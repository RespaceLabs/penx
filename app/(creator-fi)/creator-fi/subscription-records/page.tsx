'use client'

import { useSpaceContext } from '@/components/SpaceContext'
import { SubscriptionRecordList } from '../../Space/SubscriptionRecordList'

export const dynamic = 'force-static'

export default function Page() {
  const space = useSpaceContext()
  return <SubscriptionRecordList space={space} />
}
