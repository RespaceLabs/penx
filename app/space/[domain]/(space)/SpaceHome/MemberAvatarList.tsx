'use client'

import { UserAvatar } from '@/components/UserAvatar'
import { trpc } from '@/lib/trpc'

interface Props {
  spaceId: string
}

export function MemberAvatarList({ spaceId }: Props) {
  const { data = [], isLoading } = trpc.member.listBySpaceId.useQuery(spaceId)
  if (isLoading) return null

  return (
    <div className="grid gap-2">
      <div className="font-semibold text-base">Members</div>
      <div className="flex flex-wrap gap-1">
        {data.map((member) => (
          <UserAvatar className="w-9 h-9" key={member.id} user={member.user} />
        ))}
      </div>
    </div>
  )
}
