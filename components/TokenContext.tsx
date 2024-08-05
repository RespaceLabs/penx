'use client'

import { createContext, PropsWithChildren, useContext, useEffect } from 'react'

export const TokenContext = createContext('')

interface Props {
  token: string
}

export const TokenProvider = ({
  token,
  children,
}: PropsWithChildren<Props>) => {
  useEffect(() => {
    ;(window as any).__TOKEN__ = token
  }, [token])

  // console.log('====token:', token)

  return <TokenContext.Provider value={token}>{children}</TokenContext.Provider>
}

export function useTokenContext() {
  return useContext(TokenContext)
}
