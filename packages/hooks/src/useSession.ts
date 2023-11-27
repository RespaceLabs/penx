import { createContext, useContext } from 'react'
import { Session } from '@penx/store'

export const sessionContext = createContext<Session>({} as Session)

export const SessionProvider = sessionContext.Provider

export function useMenuContext() {}

export function useSession() {
  return useContext(sessionContext)
}
