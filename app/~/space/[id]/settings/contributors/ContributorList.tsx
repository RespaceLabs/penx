'use client'

import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { UserAvatar } from '@/components/UserAvatar'
import { useContributors } from '@/hooks/useContributors'
import { useSpace } from '@/hooks/useSpace'
import { trpc } from '@/lib/trpc'
import { cn, shortenAddress } from '@/lib/utils'

export function ContributorList() {
  const { space } = useSpace()
  const { contributors = [], isLoading } = useContributors()

  if (isLoading) {
    return (
      <div className="grid gap-4 mt-6">
        {Array(5)
          .fill('')
          .map((_, i) => (
            <Skeleton key={i} className="h-[60px] rounded-lg" />
          ))}
      </div>
    )
  }

  if (!contributors.length) {
    return (
      <div className="grid gap-4 mx-auto sm:w-full mt-6 text-neutral-400">
        No contributors yet.
      </div>
    )
  }

  return (
    <div className="space-y-3 mt-8">
      {contributors.map((item) => (
        <div key={item.id} className="flex justify-between">
          <div className="flex gap-2 items-center">
            <UserAvatar user={item.user} />

            <div>
              {item.user.ensName
                ? item.user.ensName
                : shortenAddress(item.user.address)}
            </div>
            {space.userId === item.user.id && <Badge>Founder</Badge>}
            {space.userId !== item.user.id && (
              <Badge variant="outline">Shareholder</Badge>
            )}
          </div>
          <div>
            <span className="font-bold">{item.shares}</span> shares
          </div>
        </div>
      ))}
    </div>
  )
}
