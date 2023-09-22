import { ReactNode } from 'react'
import { FowerHTMLProps } from '@fower/react'

export interface DrawerState {
  isOpen: boolean
}

export interface DrawerContext {
  state: DrawerState

  setState: any

  open(): void
  close(): void
}

export interface DrawerRenderProps {
  isOpen: boolean
  open(): void
  close(): void
}

export interface DrawerOwnProps {
  isLazy?: boolean

  isOpen?: boolean

  autoClose?: boolean

  portal?: boolean

  onClose?(): void

  onOpen?(): void
}

export interface DrawerOverlayProps extends FowerHTMLProps<'div'> {}

export interface DrawerContentProps extends FowerHTMLProps<'div'> {
  children: ReactNode
}

export interface DrawerProps extends FowerHTMLProps<'div'>, DrawerOwnProps {
  width?: string | number
  children: ReactNode
}
