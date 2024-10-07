'use client'

import { spaceAbi } from '@/lib/abi'
import { Address } from 'viem'
import { useReadContract } from 'wagmi'
import { UserAvatar } from './UserAvatar'
import { Subscription } from '@/domains/Subscription'

export function MemberList() {
  const { data = [], isLoading } = useReadContract({
    abi: spaceAbi,
    address: process.env.NEXT_PUBLIC_SPACE_ID as Address,
    functionName: 'getSubscriptions',
  })

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="grid gap-4">
      {data.map((member, index) => {
        const subscription = new Subscription({
          planId: member.planId,
          account: member.account,
          amount: BigInt(member.amount),
          duration: BigInt(member.duration),
          startTime: BigInt(member.startTime),
        })
        return (
          <div key={index} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <UserAvatar address={member.account} />
              <div> {member.account}</div>
            </div>
            <div>
              <span className="font-bold">{subscription.daysFormatted}</span> days
            </div>
          </div>
        )
      })}
    </div>
  )
}
