'use client'

import { useEffect } from 'react'
import { useSpaces } from '@/hooks/useSpaces'
import { useRouter } from 'next/navigation'

export default function Page() {
  const { push } = useRouter()
  const { space, spaces } = useSpaces()
  useEffect(() => {
    console.log('======space:', space)
    if (!spaces) {
      push('/~/discover')
      return
    }
    if (space) {
      push(`/~/space/${space.id}`)
    }
  }, [space, push])
  return <div></div>
  // return <div>Dashboard</div>
}
