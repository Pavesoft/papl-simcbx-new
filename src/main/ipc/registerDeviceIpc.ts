import { BrowserWindow, ipcMain } from 'electron'
import { IPC } from '@shared/ipc.types'
import { handleWithEnvelope } from './envelope'
import { getBarcodeScanner } from '../devices/barcodeScanner'
import { getLaserClient, type ConnectionStatus } from '../devices/laserMarker'
import { laserLog } from '../devices/laserLogger'
import { exportPartDataToExcel } from '../services/report.service'

function broadcast(channel: string, payload: unknown): void {
  for (const win of BrowserWindow.getAllWindows()) {
    if (!win.isDestroyed()) win.webContents.send(channel, payload)
  }
}

export function initDevices(): void {
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
    try {
      const isReady = await getLaserClient().waitForReady()
      return { ready: isReady }
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err)
      laserLog.error(`Ready check failed: ${error}`)
      return { ready: false, error }
    }
  })

  ipcMain.handle(
    IPC.LASER_MARK,
    async (_e, input: { template: string; markName: string; content: string }) => {
      const laser = getLaserClient()
      try {
        if (laser.status !== 'connected') {
          throw new Error('Laser not connected')
        }
        const waitDone = laser.waitForMarkComplete(20000)
        const sent = laser.startMarking(input.template, input.markName, input.content)
        if (!sent) {
          // Swallow the now-orphaned waiter's eventual timeout rejection, then
          // fail fast instead of blocking the caller for the full 20s window.
          waitDone.catch(() => {})
          throw new Error('Failed to send mark command - laser not connected')
        }
        await waitDone

        return { success: true, content: input.content }
      } catch (err) {
        const error = err instanceof Error ? err.message : String(err)
        laserLog.error(`Mark failed for content="${input.content}": ${error}`)
        return { success: false, error }
      }
    }
  )

  handleWithEnvelope(IPC.PART_DATA_EXPORT, exportPartDataToExcel)
}
