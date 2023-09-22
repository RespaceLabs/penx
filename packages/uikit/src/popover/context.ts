import { createContext, useContext } from 'react'
import { PopoverRenderProps } from './types'
import { usePopover } from './usePopover'

export type PopoverContextType =
  | ReturnType<typeof usePopover> & {
      setLabelId: React.Dispatch<React.SetStateAction<string | undefined>>
      setDescriptionId: React.Dispatch<React.SetStateAction<string | undefined>>
    } & {
      getRenderProps(): PopoverRenderProps
    }

export const popoverContext = createContext({} as PopoverContextType)

export const PopoverProvider = popoverContext.Provider

export const usePopoverContext = () => {
  const context = useContext(popoverContext)

  if (context == null) {
    throw new Error('Popover components must be wrapped in <Popover />')
  }
  return context
}
