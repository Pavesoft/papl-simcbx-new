import net from 'net'
import EventEmitter from 'events'
import { LASER_MARKER_DEVICE_IP, LASER_MARKER_DEVICE_PORT } from '@shared/plc.const'
import { laserLog } from './laserLogger'

export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected'

interface LaserMarkerOptions {
  host: string
  port: number
}

type PendingResponse = {
  label: string
  matcher: (msg: string) => boolean
  resolve: (value?: string) => void
  reject: (err?: Error) => void
  timeout: NodeJS.Timeout
}

export class LaserClient extends EventEmitter {
  private client: net.Socket | null = null
  private reconnectTimeout: NodeJS.Timeout | null = null
  private connectTimeout: NodeJS.Timeout | null = null
  private _RECONNECT_DELAY = 3000 // ms
  private _CONNECT_TIMEOUT = 10000 // ms - abort a connect attempt that hangs
  private _KEEPALIVE_DELAY = 5000 // ms - start TCP keepalive probes after 5s idle
  public status: ConnectionStatus = 'disconnected'
  private rxBuffer = ''
  private destroyed = false

  private host: string
  private port: number

  private pendingResponses: PendingResponse[] = []

  constructor({
    host = LASER_MARKER_DEVICE_IP,
    port = LASER_MARKER_DEVICE_PORT
  }: LaserMarkerOptions) {
    super()
    this.host = host
    this.port = port

    this.connect()
  }

  connect(): void {
    if (this.destroyed) return
    if (this.status === 'connected' || this.status === 'connecting') return

    this.status = 'connecting'
    this.emit('status', this.status)
    laserLog.info(`Connecting to laser device at ${this.host}:${this.port}`)

    this.client = new net.Socket()

    // Send command/response frames immediately (no Nagle batching), and let the
    // OS send TCP keepalive probes so a dead/half-open peer is detected in
    // seconds instead of the ~2h default - otherwise a silent link drop leaves
    // us stuck "connected" while every mark quietly times out.
    this.client.setNoDelay(true)
    this.client.setKeepAlive(true, this._KEEPALIVE_DELAY)

    // Guard against a connect attempt that never resolves (device unreachable):
    // abort it and fall into the normal reconnect cycle instead of hanging in
    // the 'connecting' state, which would block all future connect attempts.
    this.connectTimeout = setTimeout(() => {
      if (this.status === 'connecting') {
        laserLog.error(`Connect attempt timed out after ${this._CONNECT_TIMEOUT} ms`)
        this.handleDisconnect()
      }
    }, this._CONNECT_TIMEOUT)

    this.client.connect(this.port, this.host, () => {
      if (this.connectTimeout) {
        clearTimeout(this.connectTimeout)
        this.connectTimeout = null
      }
      this.status = 'connected'
      this.emit('status', this.status)
      laserLog.info(`Connected to laser device at ${this.host}:${this.port}`)
    })

    this.client.on('data', (data: Buffer) => {
      this.rxBuffer += data.toString('utf8')
      // Extract complete <...> frames from the stream
      while (true) {
        const start = this.rxBuffer.indexOf('<')
        const end = this.rxBuffer.indexOf('>', start + 1)
        if (start === -1 || end === -1) break
        const frame = this.rxBuffer.slice(start, end + 1).trim()
        this.rxBuffer = this.rxBuffer.slice(end + 1)
        laserLog.rx(`Received frame ${frame}`)
        this.handleIncomingMessage(frame)
      }
    })

    this.client.on('error', (err: Error) => {
      laserLog.error(`Socket error: ${err.message}`)
      this.handleDisconnect()
    })

    this.client.on('close', () => {
      laserLog.warn('Laser socket closed')
      this.handleDisconnect()
    })
  }

  private handleIncomingMessage(msg: string): void {
    for (const pending of [...this.pendingResponses]) {
      if (pending.matcher(msg)) {
        clearTimeout(pending.timeout)
        pending.resolve(msg)
        this.pendingResponses = this.pendingResponses.filter((p) => p !== pending)
      }
    }
  }

  private handleDisconnect(): void {
    const wasConnected = this.status === 'connected'
    this.status = 'disconnected'
    this.emit('status', this.status)
    if (wasConnected) laserLog.warn('Laser disconnected')

    // Reject any awaiting operations immediately so callers fail fast and can
    // retry, instead of hanging until their individual response timeouts.
    for (const p of this.pendingResponses) {
      clearTimeout(p.timeout)
      laserLog.error(`Aborting pending "${p.label}" - laser disconnected`)
      p.reject(new Error('Laser disconnected'))
    }
    this.pendingResponses = []
    this.rxBuffer = ''

    if (this.connectTimeout) {
      clearTimeout(this.connectTimeout)
      this.connectTimeout = null
    }

    if (this.client) {
      this.client.destroy()
      this.client = null
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
    }
    if (this.destroyed) return

    laserLog.info(`Reconnecting in ${this._RECONNECT_DELAY} ms`)
    this.reconnectTimeout = setTimeout(() => {
      this.connect()
    }, this._RECONNECT_DELAY)
  }

  /**
   * Returns true when the payload was actually handed to the socket. Callers
   * MUST check this: a silent no-op here (laser not connected) used to leave an
   * awaiting mark/ready hanging for the full response timeout before failing.
   */
  private sendRaw(command: string): boolean {
    if (this.status !== 'connected' || !this.client) {
      laserLog.error(`Cannot send "${command}" - laser not connected`)
      return false
    }

    const payload = command.endsWith('\r\n') ? command : `${command}\r\n`
    this.client.write(payload)
    laserLog.tx(`Sent ${command}`)
    return true
  }

  private waitForResponse(
    label: string,
    matcher: (msg: string) => boolean,
    timeoutMs: number = 20000
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pendingResponses = this.pendingResponses.filter((p) => p.timeout !== timeout)
        laserLog.error(`Timed out after ${timeoutMs} ms waiting for "${label}"`)
        reject(new Error(`Laser response timeout (${label})`))
        // A missing reply is the classic symptom of a half-open socket that
        // still looks "connected". Tear it down and reconnect so the NEXT
        // attempt gets a fresh link instead of timing out again and again.
        if (this.status === 'connected') {
          laserLog.warn(`Forcing reconnect - no reply to "${label}" (socket likely dead)`)
          this.handleDisconnect()
        }
      }, timeoutMs)

      this.pendingResponses.push({
        label,
        matcher,
        resolve: resolve as (value?: string) => void,
        reject,
        timeout
      })
    })
  }

  public startMarking(templateName: string, markName: string, content: string): boolean {
    laserLog.info(
      `Start marking template="${templateName}" mark="${markName}" content="${content}"`
    )
    return this.sendRaw(`<L${templateName}><D${markName},${content}><X>`)
  }

  public stopMarking(): boolean {
    return this.sendRaw(`<P>`)
  }

  public close(): void {
    this.destroyed = true
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout)
    if (this.connectTimeout) clearTimeout(this.connectTimeout)
    this.status = 'disconnected'
    this.emit('status', this.status)
    this.client?.destroy()
    this.client = null
    laserLog.info('Laser client closed')
  }

  // ✅ Awaitable helpers
  public async waitForReady(): Promise<boolean> {
    // Fail fast if we are not connected - otherwise the waiter below would hang
    // for the full response timeout before rejecting. The status check and the
    // send happen synchronously (no await between them), so the connection
    // cannot drop in the gap, and registering the waiter before sending means a
    // fast reply can never arrive before we are listening for it.
    if (this.status !== 'connected') {
      laserLog.error('Ready check aborted - laser not connected')
      throw new Error('Laser not connected')
    }
    const responsePromise = this.waitForResponse('READY', (msg) => msg.startsWith('<?XREADY'))
    this.sendRaw(`<?XREADY>`)
    const response = await responsePromise
    const ready = response.includes('<?XREADY,0>')
    laserLog.info(`Ready check -> ${ready ? 'READY' : `NOT READY (${response})`}`)
    return ready
  }

  public async waitForMarkComplete(timeout = 5000): Promise<void> {
    await this.waitForResponse('MARK_COMPLETE', (msg) => msg.includes('<XE>'), timeout)
    laserLog.info('Mark complete (<XE> received)')
  }
}

let instance: LaserClient | null = null

export function getLaserClient(): LaserClient {
  if (!instance) {
    instance = new LaserClient({
      host: process.env.LASER_IP ?? LASER_MARKER_DEVICE_IP,
      port: Number(process.env.LASER_PORT ?? LASER_MARKER_DEVICE_PORT)
    })
  }
  return instance
}

export function destroyLaserClient(): void {
  instance?.close()
  instance = null
}
