import type { ModelSetting } from '@prisma/client'
import { api, unwrap } from '../../api'

export const generatePartSerialNumber = async ({
  modelId,
  modelPartNo,
  revNo
}: {
  modelId: ModelSetting['id']
  modelPartNo: ModelSetting['partNo']
  revNo: ModelSetting['revNo']
}): Promise<string> => {
  const today = new Date()
  today.setHours(7, 0, 0, 0) // reset point: 07:00 AM today

  const previousBarcode = await unwrap(
    api.modelSerialNumber.list({
      modelId
    })
  )

  const lastEntry = previousBarcode[0]

  // Default to serial "0000" if there's no previous entry
  let serial = '0000'

  if (lastEntry) {
    const isSameDay = new Date(lastEntry.date).getTime() >= today.getTime()
    if (isSameDay) {
      const partNo = lastEntry.serialNumber.match(/^([A-Za-z0-9-]+)(\d{10})(\d{2}:\d{2}:\d{2})$/)

      // get last 4 digits of dateSerial (serial no)
      if (partNo && partNo[2]) {
        serial = partNo[2].slice(-4)
      }
    }
  }

  // Increment serial
  const serialStr = String(Number(serial) + 1).padStart(4, '0')

  // Current date/time
  const now = new Date()
  const day = String(now.getDate()).padStart(2, '0')
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const year = now.getFullYear() % 100
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')

  const ddmmyy = `${day}${month}${year}`
  const time = `${hours}:${minutes}:${seconds}`

  const content = `${modelPartNo}-${revNo}${ddmmyy}${serialStr}${time}`

  return content
}
