import { createContext, ReactNode, useContext } from 'react'
import { FowerColor } from '@fower/react'

export interface MenuContext {
  colorScheme?: FowerColor
}

export const menuContext = createContext<MenuContext>({} as MenuContext)

export const MenuProvider = menuContext.Provider

export function useMenuContext() {
  return useContext(menuContext)
}
