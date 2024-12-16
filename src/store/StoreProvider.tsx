'use client'

import { PropsWithChildren, useEffect } from 'react'
import { setLocalSession } from '@/lib/local-session'
import { UserRole } from '@prisma/client'
import { Provider } from 'jotai'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { useAccount, useDisconnect } from 'wagmi'
import { JotaiNexus } from './JotaiNexus'
import { store } from './store'

export function StoreProvider(props: PropsWithChildren) {
  const { status, data: session } = useSession()
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const pathname = usePathname()
  const { push } = useRouter()

  useEffect(() => {
    if (session) {
      window.__USER_ID__ = session.userId
    } else {
      window.__USER_ID__ = undefined as any
    }
  }, [session])

  useEffect(() => {
    setLocalSession(session as any)
  }, [session])

  // useEffect(() => {
  //   if (status === 'loading') return

  //   if (status == 'authenticated') {
  //     if (
  //       pathname === '/' &&
  //       [UserRole.ADMIN, UserRole.AUTHOR].includes(session.role as any)
  //     ) {
  //       push('/~/objects/today')
  //     }
  //   }
  // }, [status, session, push, pathname])

  return (
    <Provider store={store}>
      <JotaiNexus />
      {props.children}
    </Provider>
  )
}
