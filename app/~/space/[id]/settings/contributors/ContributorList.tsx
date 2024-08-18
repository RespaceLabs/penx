'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { UserAvatar } from '@/components/UserAvatar'
import { useSpace } from '@/hooks/useSpace'
import { trpc } from '@/lib/trpc'
import { cn, shortenAddress } from '@/lib/utils'

export function ContributorList() {
  const { space } = useSpace()
  const { data = [], isLoading } = trpc.contributor.listBySpaceId.useQuery(
    space.id,
  )

  if (isLoading) {
    return (
      <div className="grid gap-4 mx-auto w-[800x] md:w-[800px] sm:w-full mt-6">
        {Array(5)
          .fill('')
          .map((_, i) => (
            <Skeleton key={i} className="h-[60px] rounded-lg" />
          ))}
      </div>
    )
  }

  if (!data.length) {
    return (
      <div className="grid gap-4 mx-auto w-[800x] md:w-[800px] sm:w-full mt-6  text-neutral-400">
        No contributors yet.
      </div>
    )
  }

  return (
    <div className="space-y-3 mt-8">
      {data.map((item) => (
        <div key={item.id} className="flex justify-between">
          <div className="flex gap-2 items-center">
            <UserAvatar user={item.user} />

            <div>
              {item.user.ensName
                ? item.user.ensName
                : shortenAddress(item.user.address)}
            </div>
          </div>
          <div>
            <span className="font-bold">{item.shares}</span> share
          </div>
        </div>
      ))}
    </div>
  )
}
