import { createContext, useContext } from 'react'
import { CheckboxGroupContext } from './types'

export const checkboxGroupContext = createContext<CheckboxGroupContext | null>(
  null,
)

export const CheckboxGroupProvider = checkboxGroupContext.Provider

export function useCheckboxGroupContext() {
  return useContext(checkboxGroupContext)
}
