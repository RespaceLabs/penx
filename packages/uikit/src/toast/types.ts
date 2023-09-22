import { CSSProperties, ReactNode } from 'react'

export type Type = 'info' | 'success' | 'warning' | 'error' | 'loading'

export type Position =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

export interface Options {
  icon?: ReactNode

  duration?: number

  type?: Type

  showLayer?: boolean

  position?: Position

  style?: CSSProperties

  className?: string

  closable?: true

  width?: number
}

export interface Toast extends Options {
  id: number
  msg: ReactNode | (() => ReactNode)
}
