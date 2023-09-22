import { ReactNode } from 'react'
import { Placement } from '@floating-ui/react'

export interface PopoverContext {
  popoverProps: PopoverProps

  triggerProps: any
  setOpen: any

  isOpen: boolean

  isDisabled?: boolean

  renderLayer: any
  layerProps: any
  arrowProps: any

  /**
   * Open popover content
   */
  open(): void

  /**
   * Close popover content
   */
  close(): void

  getRenderProps(): {
    isOpen: boolean
    open(): void
    close(): void
  }

  triggerWidth: string | null
  setTriggerWidth: any
}

export interface PopoverRenderProps {
  isOpen: boolean
  open(): void
  close(): void
}

export interface PopoverProps {
  isLazy?: boolean

  isDisabled?: boolean

  initialOpened?: boolean

  /**
   * controlled popover
   */
  opened?: boolean

  placement?: Placement

  showMask?: boolean

  trigger?: 'click' | 'hover' | 'manual'

  onClose?(): void

  onOpen?(): void

  children: ((props: PopoverRenderProps) => ReactNode) | ReactNode
}

export interface UsePopoverReturn extends PopoverContext {}
