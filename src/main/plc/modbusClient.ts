import ModbusRTU from 'modbus-serial'
import { PLCConfig } from './plcTypes'
import { delay, toErrorMessage, withTimeout } from './plcUtils'
import { console } from './plcLogger'

export class ModbusClient {
  private client = new ModbusRTU()
  private connectedState = false
  private connecting = false

  constructor(
    private readonly config: PLCConfig,
    private readonly tag: string
  ) {}

  get connected(): boolean {
    return this.connectedState
  }

  async connect(): Promise<boolean> {
    if (!this.config.enabled) {
      console.warn(`[${this.tag}] connect() skipped because PLC is disabled`)
      return false
    }

    if (this.connectedState) return true

    if (this.connecting) {
      while (this.connecting) await delay(100)
      return this.connectedState
    }

    this.connecting = true

    try {
      await this.close()
      await withTimeout(
        this.client.connectTCP(this.config.ip, { port: this.config.port }),
        this.config.timeoutMs + 2000,
        `${this.tag} connect`
      )

      this.client.setID(this.config.unitId)
      this.client.setTimeout(this.config.timeoutMs)
      this.connectedState = true
      console.warn(
        `[${this.tag}] connected to ${this.config.ip}:${this.config.port}, unitId=${this.config.unitId}`
      )
    } catch (error) {
      console.error(`[${this.tag}] Connect failed:`, toErrorMessage(error))
      this.connectedState = false
      await this.close()
    }

    this.connecting = false
    return this.connectedState
  }

  async close(): Promise<void> {
    try {
      this.client.close()
    } catch (error) {
      // modbus-serial close can throw when the socket is already closed.
      console.warn(`[${this.tag}] close() ignored socket close error:`, toErrorMessage(error))
    }
    // Replace the client instead of reusing a dead socket.
    this.client = new ModbusRTU()
    this.connectedState = false
  }

  /**
   * A Modbus exception response (e.g. "Illegal data address") means the PLC
   * received our request and replied — the TCP link is healthy. Only
   * transport-level failures (timeouts, resets) should tear down the socket.
   */
  private static isModbusExceptionResponse(error: unknown): boolean {
    return typeof error === 'object' && error !== null && 'modbusCode' in error
  }

  async exec<T>(fn: (client: ModbusRTU) => Promise<T>): Promise<T> {
    if (!this.connectedState) throw new Error(`${this.tag} is not connected`)

    try {
      return await withTimeout(fn(this.client), this.config.timeoutMs + 500, this.tag)
    } catch (error) {
      if (ModbusClient.isModbusExceptionResponse(error)) {
        throw error
      }

      // A client-side argument error (e.g. writeRegister given an out-of-range or
      // NaN value) is thrown synchronously before any bytes reach the wire, so the
      // TCP link is still healthy. Tearing the socket down here would disconnect the
      // PLC over a caller bug; surface the error without closing the connection.
      if (error instanceof RangeError || error instanceof TypeError) {
        throw error
      }

      console.error(`[${this.tag}] exec() failed; closing client:`, toErrorMessage(error))
      this.connectedState = false
      await this.close()
      throw error
    }
  }
}
