import ModbusRTU from 'modbus-serial'

import { ModbusClient } from './modbusClient'
import { Mutex } from './mutex'
import { console } from './plcLogger'
import { DeviceOffsetEntry, PLCConfig, PLCDeviceType, PLCId, PLCStatus } from './plcTypes'
import { toErrorMessage } from './plcUtils'
import { PLC_ADDRESSES } from '@shared/plc.const'
import { PLC_CONFIG } from './plcConfigs'

/** Modbus protocol per-request limits. */
const MAX_BITS_PER_READ = 2000
const MAX_REGISTERS_PER_READ = 125
const MAX_REGISTERS_PER_WRITE = 123

interface ParsedAddress {
  type: PLCDeviceType
  /** Decimal device number (octal notation already converted). */
  num: number
  entry: DeviceOffsetEntry
}

export class PLCNode {
  readonly config: PLCConfig

  private client: ModbusClient
  private mutex = new Mutex()
  private reconnectTimer: NodeJS.Timeout | null = null
  private pollRunning = false
  /** Address specs whose poll failure was already logged; cleared on success. */
  private pollFailuresLogged = new Set<string>()
  private reconnecting = false
  private manuallyDisconnected = false
  private lastConnectedAt: number | null = null
  private lastError: string | null = null

  constructor(config: PLCConfig) {
    this.config = config
    this.client = new ModbusClient(config, config.id)
  }

  get status(): PLCStatus {
    return {
      id: this.config.id,
      label: this.config.label,
      model: this.config.model,
      ip: this.config.ip,
      enabled: this.config.enabled,
      connected: this.client.connected,
      reconnecting: this.reconnecting,
      lastConnectedAt: this.lastConnectedAt,
      lastError: this.lastError
    }
  }

  async connect(): Promise<boolean> {
    this.manuallyDisconnected = false

    if (!this.config.enabled) {
      console.warn(`[${this.config.id}] connect() skipped because PLC is disabled`)
      return false
    }

    const ok = await this.client.connect()
    if (ok) {
      this.lastConnectedAt = Date.now()
      this.lastError = null
    }
    this.startReconnectLoop()
    return ok
  }

  async disconnect(): Promise<boolean> {
    this.manuallyDisconnected = true

    if (this.reconnectTimer) {
      clearInterval(this.reconnectTimer)
      this.reconnectTimer = null
    }

    this.reconnecting = false
    await this.client.close()
    this.lastError = null
    return true
  }

  private startReconnectLoop(): void {
    if (this.manuallyDisconnected || !this.config.enabled || this.reconnectTimer) return

    this.reconnectTimer = setInterval(async () => {
      if (this.manuallyDisconnected || this.client.connected || this.reconnecting) return

      this.reconnecting = true
      try {
        const ok = await this.client.connect()
        if (ok) {
          this.lastConnectedAt = Date.now()
          this.lastError = null
        }
      } catch (error) {
        this.lastError = toErrorMessage(error)
        console.error(`[${this.config.id}] reconnect failed:`, this.lastError)
      } finally {
        this.reconnecting = false
      }
    }, this.config.reconnectIntervalMs) as unknown as NodeJS.Timeout
  }

  /**
   * Accepts "M105", "D300" and block form "D300,100" (the renderer's word-array
   * writes address whole mapping blocks, mirroring mcprotocol's writeItems).
   * X/Y device numbers are octal per Mitsubishi notation.
   */
  private parseAddress(address: string): ParsedAddress {
    const normalized = String(address).trim().toUpperCase().split(',')[0]
    const type = normalized.charAt(0) as PLCDeviceType
    const entry = this.config.deviceOffsets[type]

    if (!entry) {
      throw new Error(`Invalid PLC address: ${address} (unsupported device type "${type}")`)
    }

    const digits = normalized.substring(1)
    const num = Number.parseInt(digits, entry.octal ? 8 : 10)

    if (!digits.length || Number.isNaN(num)) {
      throw new Error(`Invalid PLC address: ${address}`)
    }

    return { type, num, entry }
  }

  private modbusAddress({ num, entry }: ParsedAddress): number {
    return entry.offset + num
  }

  private async execLocked<T>(fn: (client: ModbusRTU) => Promise<T>, label: string): Promise<T> {
    if (this.manuallyDisconnected) throw new Error(`${this.config.id} is manually disconnected`)
    if (!this.config.enabled) throw new Error(`${this.config.id} is disabled`)

    const release = await this.mutex.acquire()
    try {
      if (!this.client.connected) {
        throw new Error(`${label} client is not connected`)
      }

      const result = await this.client.exec(fn)
      this.lastError = null
      return result
    } catch (error) {
      // Every caller catches and logs with its own context; logging here too
      // would double every error line.
      this.lastError = toErrorMessage(error)
      throw error
    } finally {
      release()
    }
  }

  /** Chunked read honoring the Modbus per-request limits. */
  private async readBlock(
    parsed: ParsedAddress,
    length: number,
    label: string
  ): Promise<(boolean | number)[]> {
    const { entry } = parsed
    const isBit = entry.table !== 'holding'
    const maxPerRead = isBit ? MAX_BITS_PER_READ : MAX_REGISTERS_PER_READ
    const start = this.modbusAddress(parsed)
    const values: (boolean | number)[] = []

    for (let done = 0; done < length; done += maxPerRead) {
      const chunkStart = start + done
      const chunkLength = Math.min(maxPerRead, length - done)

      const response = await this.execLocked<{ data: (boolean | number)[] }>(async (client) => {
        switch (entry.table) {
          case 'coil':
            return client.readCoils(chunkStart, chunkLength)
          case 'discrete':
            return client.readDiscreteInputs(chunkStart, chunkLength)
          case 'holding':
            return client.readHoldingRegisters(chunkStart, chunkLength)
        }
      }, label)

      // modbus-serial pads bit reads up to the next byte; trim to the requested length.
      values.push(...response.data.slice(0, chunkLength))
    }

    return values
  }

  /**
   * Poll every configured address group. Results are keyed by the RAW mapping
   * string ("M1000,100") — byte-compatible with the old mcprotocol
   * readAllItems() payload the renderer's PLCAddressManager expects.
   * Length-less specs ("M1") produce a scalar, matching mcprotocol.
   */
  async readConfiguredPLCAddressGroups(): Promise<Record<string, unknown> | null> {
    if (this.manuallyDisconnected || !this.config.enabled || this.pollRunning) return null
    if (!this.client.connected) return null

    this.pollRunning = true
    const result: Record<string, unknown> = {}

    try {
      for (const addressSpec of PLC_ADDRESSES) {
        // A transport failure mid-poll disconnects the client; the remaining
        // groups can only fail with "not connected", so stop early.
        if (!this.client.connected) break

        try {
          const [device, lengthText] = addressSpec.split(',')
          const parsed = this.parseAddress(device)
          const isScalar = lengthText === undefined
          const length = isScalar ? 1 : Number(lengthText)

          const values = await this.readBlock(parsed, length, `poll ${addressSpec}`)
          result[addressSpec] = isScalar ? values[0] : values
          this.pollFailuresLogged.delete(addressSpec)
        } catch (error) {
          // A group the PLC rejects (e.g. unmapped R registers) must not kill
          // the rest of the poll. Log it once until it recovers.
          this.lastError = toErrorMessage(error)
          if (!this.pollFailuresLogged.has(addressSpec)) {
            this.pollFailuresLogged.add(addressSpec)
            console.error(
              `[${this.config.id}] Poll error for ${addressSpec} (skipping until it recovers):`,
              this.lastError
            )
          }
        }
      }
      return Object.keys(result).length ? result : null
    } finally {
      this.pollRunning = false
    }
  }

  async readPLCData(): Promise<Record<string, unknown> | null> {
    return this.readConfiguredPLCAddressGroups()
  }

  private assertWritable(parsed: ParsedAddress, address: string): void {
    if (parsed.entry.readOnly || parsed.entry.table === 'discrete') {
      throw new Error(`Cannot write to readonly input ${address}`)
    }
  }

  private static toBool(value: unknown): boolean {
    return value === true || value === 1 || value === '1' || value === 'true'
  }

  async write(address: string, value: unknown): Promise<boolean> {
    try {
      // Block-form address with an array value -> bulk write.
      if (Array.isArray(value)) {
        return await this.writeMultiple(address, value)
      }

      const parsed = this.parseAddress(address)
      this.assertWritable(parsed, address)
      const target = this.modbusAddress(parsed)

      if (parsed.entry.table === 'coil') {
        await this.execLocked(
          (client) => client.writeCoil(target, PLCNode.toBool(value)),
          `write ${address}`
        )
      } else {
        await this.execLocked(
          (client) => client.writeRegister(target, Number(value)),
          `write ${address}`
        )
      }

      return true
    } catch (error) {
      this.lastError = toErrorMessage(error)
      console.error(`[${this.config.id}] Write error:`, this.lastError)
      return false
    }
  }

  async writeMultiple(address: string, values: unknown[]): Promise<boolean> {
    try {
      const parsed = this.parseAddress(address)
      this.assertWritable(parsed, address)
      const start = this.modbusAddress(parsed)

      if (parsed.entry.table === 'coil') {
        const boolValues = values.map(PLCNode.toBool)
        await this.execLocked(
          (client) => client.writeCoils(start, boolValues),
          `write multiple ${address}`
        )
      } else {
        const numbers = values.map(Number)
        for (let done = 0; done < numbers.length; done += MAX_REGISTERS_PER_WRITE) {
          const chunk = numbers.slice(done, done + MAX_REGISTERS_PER_WRITE)
          await this.execLocked(
            (client) => client.writeRegisters(start + done, chunk),
            `write multiple ${address}`
          )
        }
      }

      return true
    } catch (error) {
      this.lastError = toErrorMessage(error)
      console.error(`[${this.config.id}] Write multiple error:`, this.lastError)
      return false
    }
  }

  async read(address: string): Promise<{ success: boolean; value: boolean | number | null }> {
    try {
      const parsed = this.parseAddress(address)
      const values = await this.readBlock(parsed, 1, `read ${address}`)
      return { success: true, value: values[0] ?? null }
    } catch (error) {
      this.lastError = toErrorMessage(error)
      console.error(`[${this.config.id}] Read error:`, this.lastError)
      return { success: false, value: null }
    }
  }

  async readMultiple(
    address: string,
    length: number
  ): Promise<{ success: boolean; values: (boolean | number)[] | null }> {
    try {
      const parsed = this.parseAddress(address)
      const safeLength = Math.max(1, Number(length) || 1)
      const values = await this.readBlock(parsed, safeLength, `read multiple ${address}`)
      return { success: true, values }
    } catch (error) {
      this.lastError = toErrorMessage(error)
      console.error(`[${this.config.id}] Read multiple error:`, this.lastError)
      return { success: false, values: null }
    }
  }
}

export const node = new PLCNode(PLC_CONFIG)

export function getNode(id: PLCId = PLC_CONFIG.id): PLCNode {
  if (id !== PLC_CONFIG.id) {
    throw new Error(`Unknown PLC id: ${id}`)
  }
  return node
}
