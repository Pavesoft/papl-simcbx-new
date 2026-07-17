import { PLC_MAPPINGS } from './plc.const'

// Type for supported PLC address prefixes
type PLCPrefix = 'M' | 'X' | 'Y' | 'D' | 'R'

// Describes the location of a specific address within a mapped block
interface AddressLocation {
  arrayKey: (typeof PLC_MAPPINGS)[keyof typeof PLC_MAPPINGS] // The full raw range string like "M100,100"
  index: number | null // Offset from base address (if in an array)
  isArray: boolean // True if it's part of an address block
  isBitArray: boolean // True if it's a bit-wise address (M, X, Y)
  prefix: PLCPrefix // Type prefix (e.g., M, D, R)
  mapping: string // Raw string from PLC_MAPPINGS (e.g., "M100,100")
  baseAddress?: string // Start of the block (e.g., "M100")
  length?: number // Size of the block (e.g., 100)
}

// Maps logical keys to PLC address ranges
type PLCMappings = {
  [K in keyof typeof PLC_MAPPINGS]: (typeof PLC_MAPPINGS)[keyof typeof PLC_MAPPINGS] // e.g., "M100_M199": "M100,100"
}

type PLCAddressValues = (typeof PLC_MAPPINGS)[keyof typeof PLC_MAPPINGS]

// Format returned by `readAllItems()`
export interface PLCData extends Record<
  PLCAddressValues,
  boolean[] | number[] | boolean | number
> {}

// Represents a single write operation
export interface WriteData {
  address: string
  value: boolean[] | number[] | boolean | number
}

/**
 * Helper function to resolve a raw PLC address like "M105"
 * into metadata such as array block, index, prefix, etc.
 */
function getAddressLocation(targetAddress: string, mappings: PLCMappings): AddressLocation | null {
  const match = targetAddress.match(/^([A-Z]+)(\d+)$/)
  if (!match) return null

  const [, prefix, numStr] = match
  const targetNum = parseInt(numStr)

  for (const mapping of Object.values(mappings)) {
    // Array mapping like "M100,100"
    if (mapping.includes(',')) {
      const [baseAddr, lengthStr] = mapping.split(',')
      const baseMatch = baseAddr.match(/^([A-Z]+)(\d+)$/)
      if (!baseMatch) continue

      const [, basePrefix, baseNumStr] = baseMatch
      const baseNum = parseInt(baseNumStr)
      const length = parseInt(lengthStr)

      if (prefix === basePrefix && targetNum >= baseNum && targetNum < baseNum + length) {
        return {
          arrayKey: mapping,
          index: targetNum - baseNum,
          isArray: true,
          isBitArray: ['M', 'X', 'Y'].includes(prefix as PLCPrefix),
          prefix: prefix as PLCPrefix,
          mapping,
          baseAddress: baseAddr,
          length
        }
      }
    }
    // Single scalar mapping like "M1"
    else {
      if (mapping === targetAddress) {
        return {
          arrayKey: mapping,
          index: null,
          isArray: false,
          isBitArray: ['M', 'X', 'Y'].includes(prefix as PLCPrefix),
          prefix: prefix as PLCPrefix,
          mapping
        }
      }
    }
  }

  return null
}

/**
 * PLC Address Manager — works with raw addresses only
 */
export class PLCAddressManager {
  constructor(private mappings: PLCMappings) {}

  /**
   * Prepares simple write array for raw address-value pairs
   */
  prepareWriteMultiple(addresses: string[], values: (boolean | number)[]): WriteData[] {
    return addresses.map((addr, i) => ({
      address: addr,
      value: values[i]
    }))
  }

  /**
   * Prepares a single write operation — respects readonly rules, resolves address type
   */
  prepareWrite(address: string, value: boolean | number, currentData: PLCData): WriteData {
    const location = getAddressLocation(address, this.mappings)
    if (!location) throw new Error(`Address ${address} not found in mappings`)

    // Prevent write to input-only areas like X, Y
    if (['X', 'Y'].includes(location.prefix)) {
      throw new Error(`Cannot write to readonly input ${address}`)
    }

    // Handle bit array (e.g., M105 inside M100,100)
    if (location.isArray) {
      return location.isBitArray
        ? this.prepareBitArrayWrite(location, value as boolean, currentData)
        : this.prepareWordArrayWrite(location, value as number, currentData)
    } else {
      // Scalar write
      return { address, value }
    }
  }

  /**
   * Creates a bit array write by updating a single bit in a boolean array
   */
  private prepareBitArrayWrite(
    location: AddressLocation,
    value: boolean,
    currentData: PLCData
  ): WriteData {
    const current =
      (currentData[location.arrayKey] as boolean[]) || new Array(location.length!).fill(false)
    const updated = [...current]
    updated[location.index!] = value

    // Actual address like M105
    return {
      address: `${location.prefix}${parseInt(location.baseAddress!.replace(/[^\d]/g, '')) + location.index!}`,
      value
    }
  }

  /**
   * Creates a word array write by cloning and updating a number array
   */
  private prepareWordArrayWrite(
    location: AddressLocation,
    value: number,
    currentData: PLCData
  ): WriteData {
    const current =
      (currentData[location.arrayKey] as number[]) || new Array(location.length!).fill(0)
    const updated = [...current]
    updated[location.index!] = value

    return {
      address: location.arrayKey, // e.g., "D300,100"
      value: updated
    }
  }

  /**
   * Reads a single address value from current data snapshot
   */
  readValue(address: string, currentData: PLCData): boolean | number | null {
    const location = getAddressLocation(address, this.mappings)
    if (!location) return null

    if (location.isArray && location.index != null) {
      const array = currentData[location.arrayKey] as boolean[] | number[] | undefined
      return array ? array[location.index] : null
    } else {
      return currentData[location.arrayKey] as boolean | number
    }
  }

  /**
   * Reads multiple values and returns a map of address → value
   */
  readValues(addresses: string[], currentData: PLCData): Record<string, boolean | number | null> {
    const out: Record<string, boolean | number | null> = {}
    for (const addr of addresses) {
      out[addr] = this.readValue(addr, currentData)
    }
    return out
  }

  /**
   * Prepares batched writes to minimize array cloning and merge updates
   */
  prepareBatchWrite(
    writes: Array<{ address: string; value: boolean | number }>,
    currentData: PLCData
  ): WriteData[] {
    const result: WriteData[] = []
    const buffer = new Map<string, boolean[] | number[]>() // arrayKey → updated array

    for (const write of writes) {
      const loc = getAddressLocation(write.address, this.mappings)
      if (!loc) continue

      if (loc.isArray && loc.index !== null) {
        if (!buffer.has(loc.arrayKey)) {
          const base = currentData[loc.arrayKey] as boolean[] | number[] | undefined
          buffer.set(
            loc.arrayKey,
            base ? [...base] : new Array(loc.length!).fill(loc.isBitArray ? false : 0)
          )
        }

        const arr = buffer.get(loc.arrayKey)!
        arr[loc.index] = write.value
      } else {
        result.push({ address: write.address, value: write.value })
      }
    }

    // Push all updated arrays as single write operations
    for (const [key, val] of buffer.entries()) {
      result.push({ address: key, value: val })
    }

    return result
  }
}
