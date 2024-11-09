'use client'

import { UserAvatar } from '@/components/UserAvatar'
import { Subscription } from '@/app/(creator-fi)/domains/Subscription'
import { useMembers } from '@/app/(creator-fi)/hooks/useMembers'
import { shortenAddress } from '@/lib/utils'
import { Space } from '../domains/Space'
Space

interface Props {
  space: Space
}

export function MemberList({ space }: Props) {
  const { members, isLoading } = useMembers()

  if (isLoading) return null

  if (!members?.length) {
    return <div className="text-foreground/60">No members yet!</div>
  }

  return (
    <div className="mt-4 space-y-3">
      {members.map((member, index) => {
        const subscription = new Subscription({
          planId: member.planId,
          account: member.account,
          amount: BigInt(member.amount),
          duration: BigInt(member.duration),
          startTime: BigInt(member.startTime),
        })
        return (
          <div key={index} className="flex justify-between">
            <div className="flex items-center gap-2">
              <UserAvatar address={member.account} />
              <div>{shortenAddress(member.account)}</div>
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
