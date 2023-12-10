import { ReactNode } from 'react'
import { Placement } from '@floating-ui/react'

export interface HoverCardContext {
  setOpen: any

  isOpen: boolean

  isDisabled?: boolean

  /**
   * Open hover card content
   */
  open(): void

  /**
   * Close hover card content
   */
  close(): void
}

export interface HoverCardProps {
  isDisabled?: boolean

  initialOpened?: boolean

  /**
   * controlled hover card open state
   */
  opened?: boolean

  placement?: Placement

  children: ReactNode
}

export interface UseHoverCardReturn extends HoverCardContext {}
