import { convertWordsToAsciiString } from '../../../shared/util/general.util'

export const readLaserMarkContent = (
  plcReader: (address: string) => number | boolean | null
): string => {
  const baseAddress = 685
  const wordData: number[] = []

  for (let i = 0; i < 15; i++) {
    const address = `D${baseAddress + i}`
    const value = plcReader(address) as number
    wordData.push(value)
  }

  const content = convertWordsToAsciiString(wordData, true)
  return content
}
