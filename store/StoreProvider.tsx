'use client'

import { PropsWithChildren, useEffect } from 'react'
import { Provider } from 'jotai'
import { useSession } from 'next-auth/react'
import { JotaiNexus } from './JotaiNexus'
import { store } from './store'

export function StoreProvider(props: PropsWithChildren) {
  const { data } = useSession()
  useEffect(() => {
    console.log('data=', data)
    if (data) {
      ;(window as any).__USER_ID__ = data.userId
    } else {
      ;(window as any).__USER_ID__ = undefined
    }
  }, [data])

  return (
    <Provider store={store}>
      <JotaiNexus />
      {props.children}
    </Provider>
  )
}
