import { Dispatch, ReactNode } from 'react'
import { FowerHTMLProps } from '@fower/react'

export interface ModalState<T = any> {
  isOpen: boolean
  data: T
}

export interface ModalContext<T = any> {
  state: ModalState<T>

  data: T

  setState: Dispatch<React.SetStateAction<ModalState<T>>>

  closeOnOverlayClick: boolean

  open(data?: T): void

  close(): void

  setData(data: T): void
}

export interface ModalRenderProps {
  isOpen: boolean
  open(): void
  close(): void
}

export type ModalName = string | number | Symbol

export interface ModalOwnProps {
  name?: ModalName

  isLazy?: boolean

  isOpen?: boolean

  closeOnOverlayClick?: boolean

  portal?: boolean

  onClose?(): void

  onOpen?(): void
}

export interface ModalOverlayProps extends FowerHTMLProps<'div'> {}

export interface ModalContentProps extends FowerHTMLProps<'div'> {
  children: ReactNode
}

export interface ModalProps extends ModalOwnProps {
  children: ReactNode
}
