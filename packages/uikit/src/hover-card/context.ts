import { createContext, useContext } from 'react'
import { useHoverCard } from './useHoverCard'

export type HoverCardContextType =
  | ReturnType<typeof useHoverCard> & {
      setLabelId: React.Dispatch<React.SetStateAction<string | undefined>>
      setDescriptionId: React.Dispatch<React.SetStateAction<string | undefined>>
    }

export const hoverCardContext = createContext({} as HoverCardContextType)

export const HoverCardProvider = hoverCardContext.Provider

export const useHoverCardContext = () => {
  const context = useContext(hoverCardContext)

  if (context == null) {
    throw new Error('HoverCard components must be wrapped in <HoverCard />')
  }
  return context
}
