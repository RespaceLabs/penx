'use client'

import { useEffect } from 'react'
import { useSpace } from '@/hooks/useSpace'
import { useSpaces } from '@/hooks/useSpaces'
import { usePathname, useRouter } from 'next/navigation'

export default function Page() {
  const { push } = useRouter()
  const { spaces } = useSpaces()
  const { space } = useSpace()
  const pathname = usePathname()

  useEffect(() => {
    if (!spaces.length || !space) {
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
