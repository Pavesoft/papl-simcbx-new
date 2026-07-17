import net from 'net'
import EventEmitter from 'events'
import fs from 'fs'
import path from 'path'
import { app } from 'electron'
import { LASER_MARKER_DEVICE_IP, LASER_MARKER_DEVICE_PORT } from '@shared/plc.const'

const LOG_DIR = path.join(app.getPath('userData'), 'logs')
const LOG_FILE = path.join(LOG_DIR, 'laser.log')

export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected'

interface LaserMarkerOptions {
  host: string
  port: number
}

type PendingResponse = {
  matcher: (msg: string) => boolean
  resolve: (value?: string) => void
  reject: (err?: Error) => void
  timeout: NodeJS.Timeout
}

function appendLaserLog(entry: string): void {
  const logLine = `[${new Date().toISOString()}] ${entry}\n`
  fs.mkdir(LOG_DIR, { recursive: true }, () => {
    fs.appendFile(LOG_FILE, logLine, (err) => {
      if (err) console.error('Failed to write laser log:', err)
    })
  })
}

export class LaserClient extends EventEmitter {
  private client: net.Socket | null = null
  private reconnectTimeout: NodeJS.Timeout | null = null
  private _RECONNECT_DELAY = 3000 // ms
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

    this.client = new net.Socket()

    this.client.connect(this.port, this.host, () => {
      this.status = 'connected'
      this.emit('status', this.status)
      console.log('✅ Connected to laser device')
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
        this.handleIncomingMessage(frame)
        appendLaserLog(frame)
      }
    })

    this.client.on('error', (err: Error) => {
      console.error('❌ Laser socket error:', err.message)
      this.handleDisconnect()
    })

    this.client.on('close', () => {
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
    this.status = 'disconnected'
    this.emit('status', this.status)

    // Reject any awaiting operations immediately
    for (const p of this.pendingResponses) {
      clearTimeout(p.timeout)
      p.reject(new Error('Disconnected'))
    }
    this.pendingResponses = []

    if (this.client) {
      this.client.destroy()
      this.client = null
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
    }
    if (this.destroyed) return

    this.reconnectTimeout = setTimeout(() => {
      this.connect()
    }, this._RECONNECT_DELAY)
  }

  private sendRaw(command: string): void {
    if (this.status !== 'connected' || !this.client) {
      console.warn('⚠️ Cannot send, laser not connected')
      return
    }

    const payload = command.endsWith('\r\n') ? command : `${command}\r\n`
    this.client.write(payload)
  }

  private waitForResponse(
    matcher: (msg: string) => boolean,
    timeoutMs: number = 20000
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pendingResponses = this.pendingResponses.filter((p) => p.timeout !== timeout)
        reject(new Error('Laser response timeout'))
      }, timeoutMs)

      this.pendingResponses.push({
        matcher,
        resolve: resolve as (value?: string) => void,
        reject,
        timeout
      })
    })
  }

  public startMarking(templateName: string, markName: string, content: string): void {
    this.sendRaw(`<L${templateName}><D${markName},${content}><X>`)
  }

  public stopMarking(): void {
    this.sendRaw(`<P>`)
  }

  public close(): void {
    this.destroyed = true
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout)
    this.status = 'disconnected'
    this.emit('status', this.status)
    this.client?.destroy()
    this.client = null
  }

  // ✅ Awaitable helpers
  public async waitForReady(): Promise<boolean> {
    this.sendRaw(`<?XREADY>`)
    const response = await this.waitForResponse((msg) => msg.startsWith('<?XREADY'))
    return response.includes('<?XREADY,0>')
  }

  public async waitForMarkComplete(timeout = 5000): Promise<void> {
    await this.waitForResponse((msg) => msg.includes('<XE>'), timeout)
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
