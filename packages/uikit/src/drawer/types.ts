import { ReactNode } from 'react'
import { FowerHTMLProps } from '@fower/react'

export interface DrawerState<T = any> {
  isOpen: boolean
  data: T
}

export interface DrawerContext<T = any> {
  state: DrawerState<T>

  setState: any

  open(data?: T): void

  close(): void

  setData(data: T): void
}

export interface DrawerRenderProps {
  isOpen: boolean
  open(): void
  close(): void
}

export type DrawerName = string | number | Symbol

export interface DrawerOwnProps {
  name?: DrawerName

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
