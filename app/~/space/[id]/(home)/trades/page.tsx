'use client'

import { useSpace } from '@/hooks/useSpace'
import { SubscriptionRecordList } from '../../Space/SubscriptionRecordList'

export default function Page() {
  const { space } = useSpace()
  if (!space) return
  return <SubscriptionRecordList space={space} />
}
