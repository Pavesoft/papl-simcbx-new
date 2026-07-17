import { createContext } from 'react'

export type AutoContextType = {
  barcodeScanResult: string | null
}

export const AutoContext = createContext<AutoContextType | undefined>(undefined)
