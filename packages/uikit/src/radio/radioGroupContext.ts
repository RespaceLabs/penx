import { createContext, useContext } from 'react'
import { RadioGroupContext } from './types'

export const radioGroupContext = createContext<RadioGroupContext | null>(null)

export const RadioGroupProvider = radioGroupContext.Provider

export function useRadioGroupContext() {
  return (useContext(radioGroupContext) || {}) as RadioGroupContext
}
