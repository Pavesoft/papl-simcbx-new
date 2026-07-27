import { BrowserWindow, ipcMain } from 'electron'
import { IPC, type LaserLogPayload } from '@shared/ipc.types'
import { handleWithEnvelope } from './envelope'
import { getBarcodeScanner } from '../devices/barcodeScanner'
import { getLaserClient, type ConnectionStatus } from '../devices/laserMarker'
import { laserLog, LASER_LOG_FILE } from '../devices/laserLogger'
import { exportPartDataToExcel } from '../services/report.service'

function broadcast(channel: string, payload: unknown): void {
  for (const win of BrowserWindow.getAllWindows()) {
    if (!win.isDestroyed()) win.webContents.send(channel, payload)
  }
}

export function initDevices(): void {
  laserLog.info(`Laser marker logging to ${LASER_LOG_FILE}`)
  const scanner = getBarcodeScanner()
  const laser = getLaserClient()

  scanner.on('connected', () => broadcast(IPC.SCANNER_CONNECTION, true))
  scanner.on('disconnected', () => broadcast(IPC.SCANNER_CONNECTION, false))
  laser.on('status', (status: ConnectionStatus) => broadcast(IPC.LASER_STATUS, status))
}

export function registerDeviceIpc(): void {
  // Scanner and laser results keep their original shapes (not the DbResult envelope):
  // the old tRPC procedures returned {success,...}/{ready,...} directly and the
  // AutoMode trigger utilities consume them as-is.
  ipcMain.handle(IPC.SCANNER_TRIGGER, () => getBarcodeScanner().triggerScanOnce(5000))
  ipcMain.handle(IPC.SCANNER_STATUS, () => ({ connected: getBarcodeScanner().status }))
  ipcMain.handle(IPC.SCANNER_STOP, () => {
    try {
      getBarcodeScanner().stopScan()
      return { success: true }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : String(err) }
    }
  })

  ipcMain.handle(IPC.LASER_READY, async () => {
    const laser = getLaserClient()
    const startedAt = Date.now()
    laserLog.info(`READY check requested (socket status: ${laser.status})`)
    try {
      const isReady = await laser.waitForReady()
      laserLog.info(`READY check result: ${isReady ? 'READY' : 'NOT READY'} (${Date.now() - startedAt} ms)`)
      return { ready: isReady }
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err)
      laserLog.error(`READY check FAILED after ${Date.now() - startedAt} ms: ${error}`)
      return { ready: false, error }
    }
  })

  ipcMain.handle(
    IPC.LASER_MARK,
    async (_e, input: { template: string; markName: string; content: string }) => {
      const laser = getLaserClient()
      const startedAt = Date.now()
      laserLog.info(
        `MARK requested: content="${input.content}" template="${input.template}" (socket status: ${laser.status})`
      )
      try {
        if (laser.status !== 'connected') {
          throw new Error(`laser not connected (status: ${laser.status})`)
        }
        // Listen for <XE> BEFORE sending so a fast reply is never missed.
        const waitDone = laser.waitForMarkComplete(20000)
        const sent = laser.startMarking(input.template, input.markName, input.content)
        if (!sent) {
          // Swallow the now-orphaned waiter's eventual timeout rejection, then
          // fail fast instead of blocking the caller for the full 20s window.
          waitDone.catch(() => {})
          throw new Error('failed to send mark command (write returned false)')
        }
        laserLog.info(`MARK command sent, waiting for completion (<XE>)...`)
        await waitDone

        laserLog.info(
          `MARK DONE ✅ content="${input.content}" in ${Date.now() - startedAt} ms (got <XE>)`
        )
        return { success: true, content: input.content }
      } catch (err) {
        const error = err instanceof Error ? err.message : String(err)
        laserLog.error(
          `MARK NOT DONE ❌ content="${input.content}" after ${Date.now() - startedAt} ms: ${error}`
        )
        return { success: false, error }
      }
    }
  )

  // Fire-and-forget log channel: the renderer's laser trigger flow ships its
  // log lines here so they land in the same laser-marker.log file as the
  // main-process socket/IPC logs.
  ipcMain.on(IPC.LASER_LOG, (_e, payload: LaserLogPayload) => {
    if (payload && payload.level && typeof payload.message === 'string') {
      laserLog.fromRenderer(payload.level, payload.message, payload.meta)
    }
  })

  handleWithEnvelope(IPC.PART_DATA_EXPORT, exportPartDataToExcel)
}
