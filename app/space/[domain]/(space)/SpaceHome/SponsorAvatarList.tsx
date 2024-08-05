'use client'

import { UserAvatar } from '@/components/UserAvatar'
import { trpc } from '@/lib/trpc'

interface Props {
  spaceId: string
}

export function SponsorAvatarList({ spaceId }: Props) {
  const { data = [], isLoading } = trpc.sponsor.listBySpaceId.useQuery(spaceId)
  if (isLoading) return null

  return (
    <div className="grid gap-2">
      <div className="font-semibold text-base">Sponsors</div>
      <div className="flex flex-wrap gap-1">
        {data.map((item) => (
          <UserAvatar className="w-9 h-9" key={item.id} user={item.user} />
        ))}
      </div>
    </div>
  )
}
