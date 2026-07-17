import { useContext } from 'react'
import { AutoContext } from './AutoContext'

export const useAutoContext = () => {
  const context = useContext(AutoContext)

  if (!context) {
    throw new Error('useAutoContext must be used within an AutoContextProvider')
  }

  return context
}
