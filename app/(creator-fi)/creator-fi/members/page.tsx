'use client'

import { useSpace } from '@/app/(creator-fi)/hooks/useSpace'
import { MemberList } from '../../Space/MemberList'

export const dynamic = 'force-static'
// export const revalidate = 3600 * 24

export default function Page() {
  const { space } = useSpace()

  if (!space) return null
  return <MemberList space={space}></MemberList>
}
