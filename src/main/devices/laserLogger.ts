import fs from 'fs'
import path from 'path'
import { app } from 'electron'

/**
 * Dedicated logger for the laser marker so that whenever a mark "doesn't
 * happen" we have a timestamped, level-tagged trail of exactly what the device
 * did (or failed to do). Every line lands in userData/logs/laser.log and is
 * mirrored to the console. Errors are highlighted in both places.
 */

const LOG_DIR = path.join(app.getPath('userData'), 'logs')
const LOG_FILE = path.join(LOG_DIR, 'laser.log')

export type LaserLogLevel = 'INFO' | 'TX' | 'RX' | 'WARN' | 'ERROR'

// ANSI styles for the console mirror (files stay plain-text + a marker).
const RESET = '\x1b[0m'
const CONSOLE_STYLE: Record<LaserLogLevel, string> = {
  INFO: '\x1b[36m', // cyan
  TX: '\x1b[35m', // magenta  (command sent to laser)
  RX: '\x1b[32m', // green    (frame received from laser)
  WARN: '\x1b[33m', // yellow
  ERROR: '\x1b[1m\x1b[41m\x1b[97m' // bold white on red background
}

function safeStringify(meta: unknown): string {
  if (meta === undefined) return ''
  try {
    return typeof meta === 'string' ? meta : JSON.stringify(meta)
  } catch {
    return String(meta)
  }
}

function write(level: LaserLogLevel, message: string, meta?: unknown): void {
  const ts = new Date().toISOString()
  const metaStr = meta !== undefined ? ` ${safeStringify(meta)}` : ''

  // Errors get a loud, greppable marker in the file so they stand out.
  const marker = level === 'ERROR' ? ' ‼️ ' : ' '
  const fileLine = `[${ts}] [${level}]${marker}${message}${metaStr}\n`

  fs.mkdir(LOG_DIR, { recursive: true }, () => {
    fs.appendFile(LOG_FILE, fileLine, (err) => {
      if (err) console.error('Failed to write laser log:', err)
    })
  })

  // Mirror to the console with colour so errors are impossible to miss.
  const consoleLine = `${CONSOLE_STYLE[level]}[${ts}] [LASER ${level}]${RESET} ${message}${metaStr}`
  if (level === 'ERROR') console.error(consoleLine)
  else if (level === 'WARN') console.warn(consoleLine)
  else console.log(consoleLine)
}

export const laserLog = {
  info: (message: string, meta?: unknown): void => write('INFO', message, meta),
  tx: (message: string, meta?: unknown): void => write('TX', message, meta),
  rx: (message: string, meta?: unknown): void => write('RX', message, meta),
  warn: (message: string, meta?: unknown): void => write('WARN', message, meta),
  error: (message: string, meta?: unknown): void => write('ERROR', message, meta)
}

export const LASER_LOG_FILE = LOG_FILE
