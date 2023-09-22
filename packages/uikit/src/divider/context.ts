import { createContext } from 'react'

interface DividerContext {
  orientation?: 'vertical' | 'horizontal'
}

export const dividerContext = createContext<DividerContext>(
  {} as DividerContext,
)

export const DividerProvider = dividerContext.Provider
