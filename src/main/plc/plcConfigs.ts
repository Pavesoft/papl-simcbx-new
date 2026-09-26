import {
  PLC_AUTOCONNECT_RETRY_INTERVAL,
  PLC_IP,
  PLC_MODBUS_PORT,
  PLC_POLL_INTERVAL,
  PLC_UNIT_ID
} from '@shared/plc.const'
import { DeviceOffsets, PLCConfig } from './plcTypes'

/**
 * Maps Mitsubishi device numbers to the PLC's Modbus tables.
 *
 * !! COMMISSIONING TODO !!
 * These offsets must match the PLC's "Modbus Device Assignment" parameters
 * (GX Works3). M@8192 and D@0 are the values proven on the otter FX5U;
 * the X / Y / R offsets are placeholders and MUST be calibrated against the
 * real PLC. R (file registers) may not be mapped at all by default — if so,
 * the assignment has to be enabled on the PLC side.
 * Every offset can be overridden per-site via env (see below).
 */
const envOffset = (name: string, fallback: number): number => {
  const raw = process.env[name]
  const parsed = raw ? Number(raw) : NaN
  return Number.isFinite(parsed) ? parsed : fallback
}

export const DEVICE_OFFSETS: DeviceOffsets = {
  M: { table: 'coil', offset: envOffset('PLC_OFFSET_M', 8192) },
  Y: { table: 'coil', offset: envOffset('PLC_OFFSET_Y', 0), octal: true },
  X: { table: 'discrete', offset: envOffset('PLC_OFFSET_X', 0), octal: true, readOnly: true },
  D: { table: 'holding', offset: envOffset('PLC_OFFSET_D', 0) },
  R: { table: 'holding', offset: envOffset('PLC_OFFSET_R', 30000) }
}

export const PLC_CONFIG: PLCConfig = {
  id: 'PLC1',
  label: 'SimCBX EOL',
  model: 'GENERIC',
  transport: 'tcp',
  ip: process.env.PLC_IP ?? PLC_IP,
  port: Number(process.env.PLC_PORT ?? PLC_MODBUS_PORT),
  unitId: Number(process.env.PLC_UNIT_ID ?? PLC_UNIT_ID),
  deviceOffsets: DEVICE_OFFSETS,
  timeoutMs: 3000,
  pollIntervalMs: PLC_POLL_INTERVAL,
  reconnectIntervalMs: PLC_AUTOCONNECT_RETRY_INTERVAL,
  enabled: true
}
