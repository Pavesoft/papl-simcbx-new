import { api } from '../../api'
import type { LaserLogLevel } from '@shared/ipc.types'

/**
 * Renderer-side laser logger. The renderer cannot write files, so each line is
 * shipped over IPC to the main process, which appends it to the shared
 * logs/laser-marker.log file (tagged [RENDERER]). Every line is also mirrored
 * to the DevTools console so nothing is lost while developing.
 */
function send(level: LaserLogLevel, message: string, meta?: unknown): void {
  try {
    api.laser.log({ level, message, meta })
  } catch {
    // Never let logging break the marking flow.
  }

  const line = `[LASER ${level}] ${message}`
  if (level === 'ERROR') console.error(line, meta ?? '')
  else if (level === 'WARN') console.warn(line, meta ?? '')
  else console.log(line, meta ?? '')
}

export const laserLog = {
  info: (message: string, meta?: unknown): void => send('INFO', message, meta),
  warn: (message: string, meta?: unknown): void => send('WARN', message, meta),
  error: (message: string, meta?: unknown): void => send('ERROR', message, meta)
}
