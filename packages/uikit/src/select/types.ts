import { ReactElement, ReactNode } from 'react'
import { Placement } from '@floating-ui/react'
import { FowerHTMLProps } from '@fower/react'

type StringOrNumber = string | number

export interface RenderSearchProps {
  value: any
  placeholder?: string
  setValue: (value: any) => any
  onChange: (e: any) => any
}

export type SelectSize = 'sm' | 'md' | 'lg' | number

export interface SelectProps {
  size?: SelectSize

  placement?: Placement

  portal?: boolean

  disabled?: boolean

  value?: StringOrNumber

  defaultValue?: StringOrNumber

  name?: string

  children?: ReactNode

  onChange?(nextValue: StringOrNumber): void
}

export interface SelectItemProps extends FowerHTMLProps<'input'> {}
