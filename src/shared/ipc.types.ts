/**
 * Types shared across main / preload / renderer.
 * MUST stay free of Node-only or Electron imports — the renderer bundles this file.
 */
import type { PLCData, WriteData } from './plc-address.utils'

/** Envelope returned by all auth / db / device / report IPC handlers. */
export interface DbResult<T = unknown> {
  ok: boolean
  data?: T
  error?: string
}

export type PLCId = 'PLC1'

export interface PLCStatus {
  id: PLCId
  label: string
  model: string
  ip: string
  enabled: boolean
  connected: boolean
  reconnecting: boolean
  lastConnectedAt: number | null
  lastError: string | null
}

export interface PLCReadResult {
  success: boolean
  value?: boolean | number
  error?: string
}

export interface PLCReadMultipleResult {
  success: boolean
  values?: boolean[] | number[]
  error?: string
}

export interface ScannerTriggerResult {
  success: boolean
  barcode?: string
  error?: string
}

export interface ScannerStatusResult {
  connected: boolean
}

export interface LaserReadyResult {
  ready: boolean
  error?: string
}

export interface LaserMarkResult {
  success: boolean
  content?: string
  error?: string
}

export interface ExportToExcelResult {
  filePath: string
}

export interface PartDataListParams {
  /** ISO date strings — Date objects survive IPC structured clone, but strings keep the surface JSON-safe. */
  startDate: string | Date
  endDate: string | Date
  shift?: string
}

export type { PLCData, WriteData }

/** IPC channel names (single source of truth). */
export const IPC = {
  // app
  APP_EXIT: 'app-exit',
  // auth
  AUTH_LOGIN: 'auth-login',
  AUTH_LOGOUT: 'auth-logout',
  AUTH_GET_SESSION: 'auth-get-session',
  // admin users
  USER_CREATE: 'db-user-create',
  USER_UPDATE: 'db-user-update',
  USER_UPDATE_MODEL_SETTINGS: 'db-user-update-model-settings',
  USER_LIST: 'db-user-list',
  USER_BY_ID: 'db-user-get-by-id',
  USER_DELETE: 'db-user-delete',
  // model settings
  MODEL_SETTING_CREATE: 'db-model-setting-create',
  MODEL_SETTING_LIST: 'db-model-setting-list',
  MODEL_SETTING_BY_ID: 'db-model-setting-get-by-id',
  MODEL_SETTING_UPDATE: 'db-model-setting-update',
  MODEL_SETTING_DELETE: 'db-model-setting-delete',
  // part data
  PART_DATA_CREATE: 'db-part-data-create',
  PART_DATA_LIST: 'db-part-data-list',
  PART_DATA_BY_ID: 'db-part-data-get-by-id',
  PART_DATA_UPDATE: 'db-part-data-update',
  PART_DATA_DELETE: 'db-part-data-delete',
  PART_DATA_EXPORT: 'report-export-part-data',
  // model serial numbers
  SERIAL_CREATE: 'db-serial-create',
  SERIAL_LIST: 'db-serial-list',
  SERIAL_BY_ID: 'db-serial-get-by-id',
  SERIAL_UPDATE: 'db-serial-update',
  // scanner / laser
  SCANNER_TRIGGER: 'scanner-trigger',
  SCANNER_STATUS: 'scanner-status',
  SCANNER_STOP: 'scanner-stop',
  SCANNER_CONNECTION: 'scanner-connection', // push
  LASER_READY: 'laser-ready',
  LASER_MARK: 'laser-mark',
  LASER_STATUS: 'laser-status', // push
  // plc
  PLC_CONNECT: 'plc-connect',
  PLC_DISCONNECT: 'plc-disconnect',
  PLC_GET_STATUS: 'plc-get-status',
  PLC_READ: 'plc-read',
  PLC_WRITE: 'plc-write',
  PLC_READ_MULTIPLE: 'plc-read-multiple',
  PLC_WRITE_MULTIPLE: 'plc-write-multiple',
  PLC_DATA: 'plc-data', // push
  PLC_STATUS: 'plc-status' // push
} as const
