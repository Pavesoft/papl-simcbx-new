/**
 * Converts a JavaScript float to a PLC-compatible WORDs (2 16-bit integers) and
 * returns an object with low and high WORD properties.
 * @param {number} floatValue - The float value to convert
 * @returns {Object} - An object with two properties:
 *   - low: The low WORD (least significant 16 bits)
 *   - high: The high WORD (most significant 16 bits)
 */
export function convertFloatToWord(floatValue: number) {
  // Create an ArrayBuffer to hold 4 bytes (for a 32-bit float or DWORD)
  const buffer = new ArrayBuffer(4)

  // Create a DataView to interpret the buffer
  const dataView = new DataView(buffer)

  // Write the float value as a 32-bit float (IEEE 754 single precision)
  // The 'false' argument indicates little-endian byte order.
  // Change to 'true' for big-endian if needed.
  dataView.setFloat32(0, floatValue, true)

  // Read the same 4 bytes as an unsigned 32-bit integer (DWORD)
  const dwordValue = dataView.getInt32(0, true)
  //   const smVal = dataView.getInt16(0, true);

  //   // Extract the low WORD (least significant 16 bits)
  //   const lowWord = dwordValue & 0xffff;

  //   // Extract the high WORD (most significant 16 bits)
  //   const highWord = (dwordValue >> 16) & 0xffff; // Masking again ensures it's 16-bit

  const lowWord = (dwordValue << 16) >> 16
  const highWord = dwordValue >> 16

  return {
    low: lowWord,
    high: highWord
  }
}

export function convert2WordstoFloat(wordLow: number, wordHigh: number) {
  const uLow = wordLow & 0xffff
  const uHigh = wordHigh & 0xffff

  const unsignedDword = (uHigh << 16) | uLow

  // Create an ArrayBuffer to hold 4 bytes (for a 32-bit float or DWORD)
  const buffer = new ArrayBuffer(4)

  // Create a DataView to interpret the buffer
  const dataView = new DataView(buffer)

  // Write the float value as a 32-bit float (IEEE 754 single precision)
  // The 'false' argument indicates little-endian byte order.
  // Change to 'true' for big-endian if needed.
  dataView.setInt32(0, unsignedDword, true)

  const floatValue = dataView.getFloat32(0, true)
  return Number(floatValue.toFixed(2))
}

export function convertIntToWord(intValue: number) {
  // Create an ArrayBuffer to hold 4 bytes (for a 32-bit signed integer)
  const buffer = new ArrayBuffer(4)

  // Create a DataView to work with the buffer
  const dataView = new DataView(buffer)

  // Write the 32-bit signed integer in little-endian format
  dataView.setInt32(0, intValue, true)

  // Read the lower and upper 16-bit words (little-endian)
  const lowWord = dataView.getInt16(0, true) // Offset 0
  const highWord = dataView.getInt16(2, true) // Offset 2

  return {
    low: lowWord,
    high: highWord
  }
}

export function convert2WordsToInt(wordLow: number, wordHigh: number) {
  const uLow = wordLow & 0xffff
  const uHigh = wordHigh & 0xffff

  const unsignedDword = (uHigh << 16) | uLow

  // Create an ArrayBuffer to hold 4 bytes (32-bit int)
  const buffer = new ArrayBuffer(4)
  const dataView = new DataView(buffer)

  // Write the combined 32-bit unsigned int into buffer
  dataView.setUint32(0, unsignedDword, true)

  // Read it back as signed 32-bit integer
  const intValue = dataView.getInt32(0, true)

  return intValue
}

export function convertPlcWordsToIntArray(data: number[]): number[] {
  const result: number[] = []

  for (let i = 0; i < data?.length; i += 2) {
    const wordLow = data[i]
    const wordHigh = data[i + 1]

    const intValue = convert2WordsToInt(wordLow, wordHigh)
    result.push(intValue)

    // Stop once we reach 250 values
    if (result.length === 250) break
  }

  return result
}

/**
 * Converts an ASCII string to an array of 16-bit PLC word values.
 * Each word contains 2 characters (high byte, low byte).
 * @param str - The ASCII string to convert.
 * @param wordLength - Number of 16-bit words to fill (default: 10).
 * @returns Array of word values.
 */
export function convertAsciiStringToWords(
  str: string,
  wordLength = 10,
  littleEndian = false
): number[] {
  const byteLength = wordLength * 2
  const encoder = new TextEncoder()
  let encoded = encoder.encode(str)

  if (encoded.length < byteLength) {
    const padded = new Uint8Array(byteLength)
    padded.set(encoded)
    encoded = padded
  }

  const words: number[] = []

  for (let i = 0; i < byteLength; i += 2) {
    const byte1 = encoded[i]
    const byte2 = encoded[i + 1]

    const word = littleEndian ? (byte2 << 8) | byte1 : (byte1 << 8) | byte2

    words.push(word)
  }

  return words
}

/**
 * Converts an array of 16-bit PLC word values back to an ASCII string.
 * @param words - Array of 16-bit integers.
 * @returns Decoded ASCII string.
 */
export function convertWordsToAsciiString(words: number[], littleEndian = false): string {
  const bytes: number[] = []

  for (const word of words) {
    const byte1 = (word >> 8) & 0xff
    const byte2 = word & 0xff

    if (littleEndian) {
      bytes.push(byte2, byte1) // reverse order
    } else {
      bytes.push(byte1, byte2)
    }
  }

  return new TextDecoder('ascii').decode(new Uint8Array(bytes)).replace(/\0+$/, '')
}

/**
 * Checks if two barcodes are in sequence.
 * The barcodes must be in the format "PART ddmmXXXX" where:
 * - PART is a 4-character part number
 * - ddmm is the date in the format "ddmm"
 * - XXXX is a 4-digit serial number
 *
 * The function returns true if the barcodes are in sequence, i.e. the part numbers match,
 * the date is the same, and the serial numbers are consecutive.
 * @param barcode1 - The first barcode to compare.
 * @param barcode2 - The second barcode to compare.
 * @returns True if the barcodes are in sequence, false otherwise.
 */
export const areBarcodesInSequence = (barcode1: string, barcode2: string): boolean => {
  const [part1, dateSerial1] = barcode1.split(' ')
  const [part2, dateSerial2] = barcode2.split(' ')

  if (
    !part1 ||
    !dateSerial1 ||
    !part2 ||
    !dateSerial2 ||
    dateSerial1.length < 8 ||
    dateSerial2.length < 8
  ) {
    return false // Invalid barcode format
  }

  const date1 = dateSerial1.slice(0, 4) // ddmm
  const serial1 = parseInt(dateSerial1.slice(4), 10)

  const date2 = dateSerial2.slice(0, 4) // ddmm
  const serial2 = parseInt(dateSerial2.slice(4), 10)

  // Validate parsed values
  if (isNaN(serial1) || isNaN(serial2)) {
    return false
  }

  return part1 === part2 && date1 === date2 && serial2 === serial1 + 1
}
