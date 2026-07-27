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
  const startedAt = Date.now()
  try {
    laserLog.info(
      `>>> PLC commanded START marking: template="${templateName}" field="${markName}" content="${content}"`
    )

    // 1. Check laser READY status (not just connected)
    const readyAt = Date.now()
    const { ready, error: readyError } = await api.laser.ready()
    if (!ready) {
      plcWriter([{ address: 'M1920', value: true }]) // Laser not ready bit
      laserLog.warn(
        `NOT MARKED ❌ - laser reported NOT READY (${Date.now() - readyAt} ms)${
          readyError ? `: ${readyError}` : ''
        }. Wrote M1920. Trigger will retry.`
      )
      return false
    }
    plcWriter([{ address: 'M1926', value: true }]) // Laser ready bit
    laserLog.info(`Laser READY (${Date.now() - readyAt} ms) - wrote M1926, sending mark command`)

    // 2. Call the full mark flow
    const markAt = Date.now()
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
      laserLog.info(
        `MARKED ✅ content="${content}" (mark ${Date.now() - markAt} ms, total ${
          Date.now() - startedAt
        } ms) - wrote M1921 + content to D670+`
      )
      return true
    } else {
      plcWriter([{ address: 'M1922', value: true }]) // Laser print error bit
      laserLog.error(
        `NOT MARKED ❌ content="${content}" - mark flow failed (${Date.now() - markAt} ms): ${
          result.error ?? 'unknown error'
        }. Wrote M1922. Trigger will retry.`
      )
      return false
    }
  } catch (err) {
    plcWriter([{ address: 'M1922', value: true }])
    laserLog.error(
      `NOT MARKED ❌ content="${content}" - exception after ${Date.now() - startedAt} ms. Wrote M1922. Trigger will retry.`,
      err instanceof Error ? err.message : String(err)
    )
    return false
  }
}
