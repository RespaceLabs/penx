'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { UserAvatar } from '@/components/UserAvatar'
import { useContributors } from '@/hooks/useContributors'
import { useSpace } from '@/hooks/useSpace'
import { shortenAddress } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import { useGiveShareDialog } from './GiveShareDialog/useGiveShareDialog'

export function ContributorList() {
  const { space } = useSpace()
  const { contributors = [], isLoading } = useContributors()
  const { setState } = useGiveShareDialog()
  const { data: session } = useSession()

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
          <div className="flex gap-2 items-center">
            <span className="font-bold">{item.shares}</span> shares
            <div>{getPercent(item.shares)}</div>
            <Button
              size="sm"
              variant="outline"
              className="rounded-xl"
              disabled={item.user.id === session?.userId}
              onClick={() => {
                setState({ isOpen: true, contributor: item })
              }}
            >
              Give shares
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

function getPercent(shares: number) {
  return (
    <div className="text-sm text-neutral-500">
      ({(shares / 1_000_000) * 100}%)
    </div>
  )
}
