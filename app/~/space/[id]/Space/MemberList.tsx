'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useMembers } from '@/hooks/useMembers'
import { precision } from '@/lib/math'
import { Space } from '@prisma/client'

interface Props {
  space: Space
}

export function MemberList({ space }: Props) {
  const { members } = useMembers(space.id)

  return (
    <div className="space-y-3 mt-4">
      {members.map((member) => (
        <div key={member.id} className="flex justify-between">
          <div className="flex gap-2 items-center">
            <Avatar>
              <AvatarImage src="" alt="" />
              <AvatarFallback>{member.user.address.slice(-2)}</AvatarFallback>
            </Avatar>
            <div>{member.user.address}</div>
          </div>
          <div>
            has{' '}
            <span className="font-bold">
              {precision.toDecimal(BigInt(member.amount))}
            </span>{' '}
            Keys
          </div>
        </div>
      ))}
    </div>
  )
}
