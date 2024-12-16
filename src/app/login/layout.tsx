'use client'

import { PropsWithChildren, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function Layout({ children }: PropsWithChildren) {
  const { data, status } = useSession()
  const { push } = useRouter()

  useEffect(() => {
    if (data) {
      push('/')
    }
  }, [data, push])
  if (status === 'loading') return null
  return <>{children}</>
}
