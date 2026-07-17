import type { FC, PropsWithChildren } from 'react'
import { AutoContext, type AutoContextType } from './AutoContext'

type AutoContextProviderType = AutoContextType & PropsWithChildren

export const AutoContextProvider: FC<AutoContextProviderType> = ({ children, ...props }) => {
  return <AutoContext.Provider value={{ ...props }}>{children}</AutoContext.Provider>
}
