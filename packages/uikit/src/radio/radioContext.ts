import { createContext, useContext } from 'react'
import { RadioContext } from './types'

export const radioContext = createContext<RadioContext | null>(null)

export const RadioProvider = radioContext.Provider

export function useRadioContext() {
  return (useContext(radioContext) || {}) as RadioContext
}
