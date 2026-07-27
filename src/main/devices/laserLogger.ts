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
/** Candidate log folders, in priority order, depending on dev vs packaged. */
function candidateDirs(): string[] {
  if (!app.isPackaged) {
    // Dev: repo root /logs (process.cwd() is the project root under npm run dev)
    return [path.join(process.cwd(), 'logs')]
  }
  // Packaged: prefer a logs folder next to the .exe (easy to find), then fall
  // back to the always-writable userData folder.
  return [
    path.join(path.dirname(app.getPath('exe')), 'logs'),
    path.join(app.getPath('userData'), 'logs')
  ]
}

/**
 * Pick the first candidate we can actually WRITE to. On Windows fs.accessSync
 * is unreliable for directories, so we probe with a real write+delete instead.
 */
function resolveLogDir(): string {
  const candidates = candidateDirs()
  for (const dir of candidates) {
    try {
      fs.mkdirSync(dir, { recursive: true })
      const probe = path.join(dir, '.write-test')
      fs.writeFileSync(probe, 'ok')
      fs.unlinkSync(probe)
      return dir
    } catch {
      // not writable - try the next candidate
    }
  }
  // Last resort: userData (best effort even if the probe failed above).
  return path.join(app.getPath('userData'), 'logs')
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

  // Synchronous append: this is a low-frequency diagnostic log, and writing
  // synchronously keeps lines in exact order and flushed to disk immediately -
  // so a crash mid-mark can't lose the line that explains why.
  try {
    fs.appendFileSync(LOG_FILE, fileLine)
  } catch (err) {
    console.error('Failed to write laser log:', err)
  }

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
