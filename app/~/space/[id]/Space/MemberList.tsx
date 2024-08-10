'use client'

import { UserAvatar } from '@/components/UserAvatar'
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
      {members.map((member) => (
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
            has <span className="font-bold">{member.amount}</span> Keys
          </div>
        </div>
      ))}
    </div>
  )
}
