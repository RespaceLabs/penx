import { createContext, useContext } from 'react'

export interface Session {
  userId: string
  address: string
  earlyAccessCode: string
  publicKey: string
  secret: string
  email: string
  user: {
    name: string
    email: string
    image: string
    id: string
  }
}

export interface SessionContextValue {
  data: Session
  loading: boolean
}

export const sessionContext = createContext<SessionContextValue>({
  data: null,
  loading: true,
} as any)

export const SessionProvider = sessionContext.Provider

export function useSession() {
  return useContext(sessionContext)
}
