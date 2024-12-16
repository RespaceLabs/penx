'use client'

import { useSpaceContext } from '../../../../components/SpaceContext'
import { MemberList } from '../../Space/MemberList'

export const dynamic = 'force-static'
// export const revalidate = 3600 * 24

export default function Page() {
  const space = useSpaceContext()
  return <MemberList space={space}></MemberList>
}
