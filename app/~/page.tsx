'use client'

import { useEffect } from 'react'
import { useSpaces } from '@/hooks/useSpaces'
import { usePathname, useRouter } from 'next/navigation'

export default function Page() {
  const { push } = useRouter()
  const { space, spaces } = useSpaces()
  const pathname = usePathname()
  console.log('=======pathname:', pathname)

  useEffect(() => {
    console.log('======space:', space)
    if (!spaces.length) {
      push('/~/discover')
      return
    }

    if (space) {
      push(`/~/space/${space.id}`)
    }
  }, [space, push, spaces])
  return <div></div>
  // return <div>Dashboard</div>
}
