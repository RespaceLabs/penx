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

  /**
   * 初始化时是否打开
   */
  initialOpened?: boolean

  /**
   * controlled hover card open state
   */
  opened?: boolean

  /**
   * 放置位置
   */
  placement?: Placement

  children: ReactNode
}

export interface UseHoverCardReturn extends HoverCardContext {}
