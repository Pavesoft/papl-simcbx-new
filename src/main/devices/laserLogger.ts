import fs from 'fs'
import path from 'path'
import { app } from 'electron'
import type { LaserLogLevel } from '@shared/ipc.types'

/**
 * Dedicated logger for the laser marker so that whenever a mark "doesn't
 * happen" we have a timestamped, level-tagged trail of exactly what the device
 * did (or failed to do). Every line lands in a logs/laser-marker.log file and
 * is mirrored to the console. Errors are highlighted in both places.
 *
 * Both the main process (socket / IPC layer) and the renderer (AutoMode trigger
 * flow) write here - renderer lines arrive over IPC and are tagged [RENDERER]
 * so a single file tells the whole story of a mark.
 *
 * The folder is created automatically on first write, and is resolved to a
 * writable location for BOTH `npm run dev` and the packaged .exe:
 *   - dev        -> <repo root>/logs        (process.cwd() is the project root)
 *   - packaged   -> <folder of the .exe>/logs, or, if that isn't writable
 *                   (e.g. an install under Program Files), the always-writable
 *                   userData folder as a fallback.
 */
function resolveLogDir(): string {
  if (!app.isPackaged) {
    return path.join(process.cwd(), 'logs')
  }

  // Prefer a logs folder right next to the executable so it's easy to find.
  const nextToExe = path.join(path.dirname(app.getPath('exe')), 'logs')
  try {
    fs.mkdirSync(nextToExe, { recursive: true })
    fs.accessSync(nextToExe, fs.constants.W_OK)
    return nextToExe
  } catch {
    // Install dir is read-only (Program Files, etc.) - fall back to userData,
    // which is guaranteed writable: %APPDATA%\simcbx-papl\logs on Windows.
    return path.join(app.getPath('userData'), 'logs')
  }
}

const LOG_DIR = resolveLogDir()
const LOG_FILE = path.join(LOG_DIR, 'laser-marker.log')

export type { LaserLogLevel }
export type LaserLogSource = 'MAIN' | 'RENDERER'

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

function write(
  level: LaserLogLevel,
  message: string,
  meta?: unknown,
  source: LaserLogSource = 'MAIN'
): void {
  const ts = new Date().toISOString()
  const metaStr = meta !== undefined ? ` ${safeStringify(meta)}` : ''

  // Errors get a loud, greppable marker in the file so they stand out.
  const marker = level === 'ERROR' ? ' ‼️ ' : ' '
  const fileLine = `[${ts}] [${source}] [${level}]${marker}${message}${metaStr}\n`

  fs.mkdir(LOG_DIR, { recursive: true }, () => {
    fs.appendFile(LOG_FILE, fileLine, (err) => {
      if (err) console.error('Failed to write laser log:', err)
    })
  })

  // Mirror to the console with colour so errors are impossible to miss.
  const consoleLine = `${CONSOLE_STYLE[level]}[${ts}] [LASER ${source} ${level}]${RESET} ${message}${metaStr}`
  if (level === 'ERROR') console.error(consoleLine)
  else if (level === 'WARN') console.warn(consoleLine)
  else console.log(consoleLine)
}

export const laserLog = {
  info: (message: string, meta?: unknown): void => write('INFO', message, meta),
  tx: (message: string, meta?: unknown): void => write('TX', message, meta),
  rx: (message: string, meta?: unknown): void => write('RX', message, meta),
  warn: (message: string, meta?: unknown): void => write('WARN', message, meta),
  error: (message: string, meta?: unknown): void => write('ERROR', message, meta),
  /** Persist a log line that originated in the renderer (arrives over IPC). */
  fromRenderer: (level: LaserLogLevel, message: string, meta?: unknown): void =>
    write(level, message, meta, 'RENDERER')
}

export const LASER_LOG_FILE = LOG_FILE
