'use client'

import { useSpace } from '../hooks/useSpace'
import { MemberList } from '../Space/MemberList'

export default function Page() {
  const { space } = useSpace()
  if (!space) return null
  return <MemberList space={space}></MemberList>
}
