import { convertAsciiStringToWords } from '../../shared/util/general.util'
import { api } from '../../api'
import { laserLog } from './laserLog'

/**
 * Returns true only when the laser actually completed a mark. Callers must
 * check this before recording the serial number - otherwise a not-ready laser
 * or a failed/exception mark would still advance the stored serial as if the
 * part had been marked.
 */
export const triggerLaserMarker = async (
  plcWriter: (writes: { address: string; value: number | boolean }[]) => void,
  templateName: string,
  markName: string,
  content: string
): Promise<boolean> => {
  try {
    laserLog.info(`Trigger laser marker: template="${templateName}" content="${content}"`)

    // 1. Check laser READY status (not just connected)
    const { ready } = await api.laser.ready()
    if (!ready) {
      plcWriter([{ address: 'M1920', value: true }]) // Laser not ready bit
      laserLog.warn('Laser not ready - wrote M1920, aborting this attempt')
      return false
    }
    plcWriter([{ address: 'M1926', value: true }]) // Laser ready bit
    laserLog.info('Laser ready - wrote M1926, sending mark command')

    // 2. Call the full mark flow
    const result = await api.laser.mark({
      template: templateName,
      markName,
      content
    })

    if (result.success) {
      // convert the laser marking content to words
      const words = convertAsciiStringToWords(content, 15, true)
      const markContentWrites = words.map((value, i) => ({
        address: `D${670 + i}`,
        value
      }))
      //write the content in PLC along with laser print OK bit
      plcWriter([{ address: 'M1921', value: true }])
      plcWriter([{ address: 'D669', value: 0 }, ...markContentWrites]) // Laser print OK bit
      laserLog.info(`Laser marking completed - wrote M1921 and content to D670+ for "${content}"`)
      return true
    } else {
      plcWriter([{ address: 'M1922', value: true }]) // Laser print error bit
      laserLog.error(`Laser mark failed - wrote M1922: ${result.error ?? 'unknown error'}`)
      return false
    }
  } catch (err) {
    plcWriter([{ address: 'M1922', value: true }])
    laserLog.error('Laser error - wrote M1922', err instanceof Error ? err.message : String(err))
    return false
  }
}
