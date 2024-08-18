'use client'

import { UserAvatar } from '@/components/UserAvatar'
import { Subscription } from '@/domains/Subscription'
import { useMembers } from '@/hooks/useMembers'
import { shortenAddress } from '@/lib/utils'
import { Space } from '@prisma/client'

interface Props {
  space: Space
}

export function MemberList({ space }: Props) {
  const { members, isLoading } = useMembers(space.id)

  if (isLoading) return null

  if (!members?.length) {
    return <div className="text-neutral-500">No members yet!</div>
  }

  return (
    <div className="space-y-3 mt-4">
      {members.map((member) => {
        const subscription = new Subscription({
          amount: BigInt(member.amount),
          checkpoint: BigInt(member.checkpoint),
          duration: BigInt(member.duration),
          consumed: BigInt(member.consumed),
          start: BigInt(member.start),
        })
        return (
          <div key={member.id} className="flex justify-between">
            <div className="flex gap-2 items-center">
              <UserAvatar user={member.user} />

              <div>
                {member.user.ensName
                  ? member.user.ensName
                  : shortenAddress(member.user.address)}
              </div>
            </div>
            <div>
              <span className="font-bold">{subscription.daysFormatted}</span>{' '}
              days
            </div>
          </div>
        )
      })}
    </div>
  )
}
