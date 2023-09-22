import { createContext, useContext } from 'react'

export enum Placement {
  'start' = 'start',
  'middle' = 'middle',
  'end' = 'end',
}

export interface InputGroupContext {
  size: any

  /**
   * placement map
   */
  placementMap: Map<any, { id: string; placement: Placement }>
}

export const inputGroupContext = createContext<InputGroupContext>(
  {} as InputGroupContext,
)

export const InputGroupProvider = inputGroupContext.Provider

export function useInputGroupContext() {
  return useContext(inputGroupContext)
}
