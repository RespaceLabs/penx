import React from 'react'
import { useSession } from 'next-auth/react'
import { Dashboard } from '@penx/app'
import { SessionProvider } from '@penx/session'

export default function DashboardPage() {
  const { data: session, status } = useSession()

  return (
    <SessionProvider
      value={{
        data: session as any,
        loading: status === 'loading',
      }}
    >
      <Dashboard userId={session?.userId as string} />
    </SessionProvider>
  )
}
