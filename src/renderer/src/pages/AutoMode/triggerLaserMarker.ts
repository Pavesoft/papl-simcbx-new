import { convertAsciiStringToWords } from '../../shared/util/general.util'
import { api } from '../../api'

export const triggerLaserMarker = async (
  plcWriter: (writes: { address: string; value: number | boolean }[]) => void,
  templateName: string,
  markName: string,
  content: string
) => {
  try {
    // 1. Check laser READY status (not just connected)
    const { ready } = await api.laser.ready()
    if (!ready) {
      plcWriter([{ address: 'M1920', value: true }]) // Laser not ready bit
      console.warn('Laser not ready')
      return
    }
    plcWriter([{ address: 'M1926', value: true }]) // Laser ready bit

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
      console.log('✅ Laser marking completed', markContentWrites)
    } else {
      plcWriter([{ address: 'M1922', value: true }]) // Laser print error bit
      console.error('❌ Laser mark failed:', result.error)
    }
  } catch (err) {
    plcWriter([{ address: 'M1922', value: true }])
    console.error('❌ Laser error:', err)
  }
}
