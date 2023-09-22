import { ReactNode } from 'react'
import { FowerHTMLProps } from '@fower/react'

export type StringOrNumber = string | number

export type HtmlInputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>

export interface RadioProps extends Omit<FowerHTMLProps<'input'>, 'children'> {
  children: ((props: RadioRenderProps) => ReactNode) | ReactNode
}

export interface RadioRenderProps {
  checked: boolean

  disabled: boolean
}

export interface RadioHooksResult {
  inputProps: HtmlInputProps

  state: {
    checked: boolean
    disabled: boolean
  }
}

export interface RadioGroupProps
  extends Omit<FowerHTMLProps<'div'>, 'onChange' | 'value' | 'defaultValue'> {
  value?: StringOrNumber

  defaultValue?: StringOrNumber

  name?: string

  onChange?(nextValue: StringOrNumber): void
}

export interface UseRadioGroupReturn {
  name: string
  controlled: boolean
  value?: StringOrNumber
  onChange: any
  setValue: any
  // inputProps: InputProps
  // state: {
  //   checked?: boolean
  //   disabled?: boolean
  // }
  [key: string]: any
}

export interface RadioGroupContext {
  /**
   * radio group unique name
   */
  name?: string

  /**
   * radio group name, string or number
   */
  value: any

  setValue: any
}

export interface RadioContext {
  checked: boolean
  disabled: boolean
}
