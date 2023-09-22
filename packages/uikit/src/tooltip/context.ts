import { createContext, useContext } from 'react'
import { useTooltip } from './useTooltip'

export type TooltipContextType =
  | ReturnType<typeof useTooltip> & {
      setLabelId: React.Dispatch<React.SetStateAction<string | undefined>>
      setDescriptionId: React.Dispatch<React.SetStateAction<string | undefined>>
    }

export const tooltipContext = createContext({} as TooltipContextType)

export const TooltipProvider = tooltipContext.Provider

export const useTooltipContext = () => {
  const context = useContext(tooltipContext)

  if (context == null) {
    throw new Error('Tooltip components must be wrapped in <Tooltip />')
  }
  return context
}
