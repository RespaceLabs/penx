import { ReactNode } from 'react'
import { FowerColor, FowerHTMLProps } from '@fower/react'

type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>

type StringOrNumber = string | number

export type CheckboxGroupValue = StringOrNumber[]

export interface CheckboxProps extends FowerHTMLProps<'input'> {
  colorScheme?: FowerColor

  render?: (status: CheckboxStatus) => ReactNode
}

export interface CheckboxStatus {
  checked?: boolean

  disabled?: boolean

  focused?: boolean

  children?: ReactNode
}

export interface UseCheckboxReturn {
  inputProps: InputProps

  state: {
    checked?: boolean
    disabled?: boolean
  }
}

export interface UseCheckboxGroupReturn {
  controlled: boolean
  value?: CheckboxGroupValue
  onChange: any
  setValue: any
  // inputProps: InputProps
  // state: {
  //   checked?: boolean
  //   disabled?: boolean
  // }
  [key: string]: any
}

export interface CheckboxOption {
  label: React.ReactNode
  value: any
  disabled?: boolean
}

export interface CheckboxGroupProps
  extends Omit<FowerHTMLProps<'div'>, 'onChange' | 'value' | 'defaultValue'> {
  value?: CheckboxGroupValue

  defaultValue?: CheckboxGroupValue

  onChange?(value: CheckboxGroupValue): void

  options?: CheckboxOption[]

  name?: string
}

export interface CheckboxGroupContext
  extends Pick<UseCheckboxGroupReturn, 'onChange' | 'value'> {
  // TODO: handle any
  setValue: any

  controlled: boolean
}
