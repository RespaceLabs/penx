import { createContext, ReactNode, useContext } from 'react'

export type SelectContextType = {
  selectedItem: ReactNode
  setSelectedItem: React.Dispatch<any>
  height?: number | string
}

export const selectContext = createContext({} as SelectContextType)

export const SelectProvider = selectContext.Provider

export const useSelectContext = () => {
  const context = useContext(selectContext)

  if (context == null) {
    throw new Error('Select components must be wrapped in <Select />')
  }
  return context
}
