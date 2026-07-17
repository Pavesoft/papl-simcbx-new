import { api } from '../../api'
import { readLaserMarkContent } from './utils'

export const triggerScanner = async (
  plcReader: (address: string) => number | boolean | null,
  plcWriter: (writes: { address: string; value: number | boolean }[]) => void
) => {
  try {
    // Step 1: Check connection
    const status = await api.scanner.status()
    if (!status.connected) {
      // Scanner not connected, write error bit to PLC
      plcWriter([{ address: 'M1928', value: true }])
      console.warn('Scanner not connected')
      return
    }
    plcWriter([{ address: 'M1931', value: true }])

    // Step 2: Scanner is connected and ready, trigger scan
    const res = await api.scanner.trigger()

    const laserMarkContent = readLaserMarkContent(plcReader)

    // check if scanned barcode matches with laserMarkContent from stage 7
    if (res.success && res.barcode === laserMarkContent) {
      plcWriter([
        { address: 'M1905', value: false },
        { address: 'M1929', value: true }
      ])
      console.log('Scan okay')
    } else {
      plcWriter([{ address: 'M1930', value: true }])
      console.warn(`Scan not okay`, res.error)
    }
    return res
  } catch (err) {
    // Catch all errors from any step
    console.error('Error in triggerScanner:', err)
    // Write general error bit to PLC
    plcWriter([{ address: 'M1930', value: true }])
    return undefined
  }
}
