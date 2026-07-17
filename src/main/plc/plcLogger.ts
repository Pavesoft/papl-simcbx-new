import { appendFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { app } from 'electron'
import { join } from 'node:path'

const PLC_SERVICE_LOG_DIR = join(app.getPath('userData'), 'logs')
export const PLC_SERVICE_LOG_FILE = join(PLC_SERVICE_LOG_DIR, 'plc-service.log')

// Routine logs (every mutex acquire / exec / poll read) would mean hundreds of
// synchronous file writes per 800ms poll cycle. Persist WARN/ERROR always;
// INFO only when PLC_DEBUG is set.
const PLC_DEBUG = process.env.PLC_DEBUG === '1' || process.env.PLC_DEBUG === 'true'

function stringifyValueForPLCLog(value: unknown): string {
  if (value instanceof Error) return value.stack ?? value.message
  if (typeof value === 'string') return value

  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

export function appendLineToPLCServiceLogFile(
  level: 'INFO' | 'WARN' | 'ERROR',
  message: string
): void {
  const line = `${new Date().toISOString()} [${level}] ${message}\n`

  try {
    mkdirSync(PLC_SERVICE_LOG_DIR, { recursive: true })
    appendFileSync(PLC_SERVICE_LOG_FILE, line, 'utf8')
  } catch (error) {
    globalThis.console.error('[PLCService] Failed to write log file:', error)
  }
}

export function resetPLCServiceLogFile(): void {
  try {
    mkdirSync(PLC_SERVICE_LOG_DIR, { recursive: true })
    writeFileSync(PLC_SERVICE_LOG_FILE, '', 'utf8')
  } catch (error) {
    globalThis.console.error('[PLCService] Failed to reset log file:', error)
  }
}

function write(level: 'INFO' | 'WARN' | 'ERROR', values: unknown[]): void {
  if (level === 'INFO' && !PLC_DEBUG) return
  appendLineToPLCServiceLogFile(level, values.map(stringifyValueForPLCLog).join(' '))
}

export const console = {
  log: (...values: unknown[]): void => write('INFO', values),
  warn: (...values: unknown[]): void => write('WARN', values),
  error: (...values: unknown[]): void => write('ERROR', values)
}
