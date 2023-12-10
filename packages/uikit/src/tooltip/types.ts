import { ReactNode } from 'react'
import { Placement } from '@floating-ui/react'

export interface TooltipContext {
  setOpen: any

  isOpen: boolean

  isDisabled?: boolean

  /**
   * Open tooltip content
   */
  open(): void

  /**
   * Close tooltip content
   */
  close(): void
}

export interface TooltipProps {
  isDisabled?: boolean

  initialOpened?: boolean

  /**
   * controlled tooltip
   */
  opened?: boolean

  placement?: Placement

  children: ReactNode
}

export interface UseTooltipReturn extends TooltipContext {}
