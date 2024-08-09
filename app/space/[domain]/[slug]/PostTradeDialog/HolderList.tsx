'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { UserAvatar } from '@/components/UserAvatar'
import { useHolders } from '@/hooks/useHolders'
import { PostWithSpace } from '@/hooks/usePost'
import { precision } from '@/lib/math'
import { getEnsAvatar, shortenAddress } from '@/lib/utils'
import { Space } from '@prisma/client'

interface Props {
  space: Space
  post: PostWithSpace
}

export function HolderList({ space, post }: Props) {
  const { holders, isLoading } = useHolders(post.id)

  if (isLoading) {
    return (
      <div className="grid gap-2">
        {Array(10)
          .fill('')
          .map((_, index) => (
            <Skeleton key={index} className="h-8" />
          ))}
      </div>
    )
  }

  if (holders.length === 0) {
    return (
      <div className="flex flex-col items-center text-gray-600 text-sm">
        No holders yet
      </div>
    )
  }

  return (
    <div className="space-y-3 mt-4">
      {holders.map((item) => (
        <div key={item.id} className="flex justify-between">
          <div className="flex gap-2 items-center">
            <UserAvatar className="w-7 h-7" user={item.user as any} />
            <div>{item.user.ensName || shortenAddress(item.user.address)}</div>
          </div>
          <div>
            <span className="font-bold">{item.amount}</span> Keys
          </div>
        </div>
      ))}
    </div>
  )
}
