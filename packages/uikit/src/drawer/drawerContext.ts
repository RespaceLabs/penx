import { createContext } from 'react'
import { DrawerContext } from './types'

export const drawerContext = createContext({} as DrawerContext)

export const DrawerProvider = drawerContext.Provider
