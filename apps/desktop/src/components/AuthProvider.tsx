import React, { PropsWithChildren, useEffect, useState } from 'react'
import { SessionProvider, useSession } from '@penx/session'
import { getLocalSession, setLocalSession } from '@penx/storage'

function OnlineProvider({ children }: PropsWithChildren) {
  const { data: session } = useSession()

  useEffect(() => {
    setLocalSession(session)
  }, [session])

  return (
    <SessionProvider
      value={{
        data: session as any,
        loading: false,
      }}
    >
      {children}
    </SessionProvider>
  )
}

function OfflineProvider({ children }: PropsWithChildren) {
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<any>()

  useEffect(() => {
    getLocalSession().then((session) => {
      if (!session) {
        // TODO:
        // go to login page
        return
      }
      setSession(session)
      setLoading(false)
    })
  }, [])

  if (loading || !session) return null

  return (
    <SessionProvider
      value={{
        data: session,
        loading: false,
      }}
    >
      {children}
    </SessionProvider>
  )
}

export function AuthProvider({ children }: PropsWithChildren) {
  const isOnline = navigator.onLine

  if (isOnline) return <OnlineProvider>{children}</OnlineProvider>
  return <OfflineProvider>{children}</OfflineProvider>
}
