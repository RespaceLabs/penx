'use client'

import { PropsWithChildren, useEffect } from 'react'
import { setLocalSession } from '@/lib/local-session'
import { Provider } from 'jotai'
import { usePathname, useRouter } from 'next/navigation'
import { useAccount, useDisconnect } from 'wagmi'
import { JotaiNexus } from './JotaiNexus'
import { store } from './store'

export function StoreProvider(props: PropsWithChildren) {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const pathname = usePathname()
  const { push } = useRouter()

  return (
    <Provider store={store}>
      <JotaiNexus />
      {props.children}
    </Provider>
  )
}
