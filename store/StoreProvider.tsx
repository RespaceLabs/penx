'use client'

import { PropsWithChildren, useEffect } from 'react'
import { Provider } from 'jotai'
import { useSession } from 'next-auth/react'
import { useAccount, useDisconnect } from 'wagmi'
import { JotaiNexus } from './JotaiNexus'
import { store } from './store'

export function StoreProvider(props: PropsWithChildren) {
  const { status, data: session } = useSession()
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  useEffect(() => {
    if (session) {
      ;(window as any).__USER_ID__ = session.userId
    } else {
      ;(window as any).__USER_ID__ = undefined
    }
  }, [session])

  useEffect(() => {
    if (status === 'loading') return
    if (status == 'unauthenticated' && address) {
      disconnect()
    }
  }, [status, address, disconnect])

  return (
    <Provider store={store}>
      <JotaiNexus />
      {props.children}
    </Provider>
  )
}
