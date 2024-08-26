'use client'

import { MemberDialog } from '@/components/MemberDialog/MemberDialog'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { UpdatePriceDialog } from '@/components/UpdatePriceDialog/UpdatePriceDialog'
import { useSpace } from '@/hooks/useSpace'
import { cn } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ClaimShareRewards } from './ClaimShareRewards'
import { MemberButton } from './MemberButton'
import { SpaceAddress } from './SpaceAddress'
import { SpaceBasicInfo } from './SpaceBasicInfo'
import { SpaceHomeLink } from './SpaceHomeLink'
import { SpaceTheme } from './SpaceTheme'

interface Props {}

export function SpaceInfo({}: Props) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { isLoading, space } = useSpace()

  if (isLoading) {
    return (
      <div className="grid gap-6">
        <div className="flex  justify-between w-full">
          <div className="flex items-center gap-2">
            <Skeleton className="w-20 h-20 rounded-full" />
            <Skeleton className="w-20 h-5" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="w-20 h-10" />
            <Skeleton className="w-20 h-10" />
          </div>
        </div>

        <Skeleton className="h-[120px]" />

        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-[350px] rounded-4xl" />
          <Skeleton className="h-[350px] rounded-4xl" />
        </div>
      </div>
    )
  }

  if (!space) return null

  const Paths = {
    posts: `/~/space/${space.id}`,
    members: `/~/space/${space.id}/members`,
    sponsors: `/~/space/${space.id}/sponsors`,
    trades: `/~/space/${space.id}/trades`,
  }

  const linkClassName = (path: string) =>
    cn(
      'inline-flex item-center justify-center py-1.5 border-b-2 px-3 -mb-[1px] border-transparent',
      path === pathname && 'border-black',
    )

  return (
    <div className="grid gap-6">
      <div className="flex md:flex-row flex-col justify-between w-full gap-y-2">
        <div className="flex flex-col gap-2">
          <SpaceBasicInfo />
          <div className="flex gap-2">
            <SpaceHomeLink subdomain={space.subdomain!} />
            {session && <SpaceTheme />}
            <SpaceAddress />
          </div>
        </div>

        <div className="flex gap-2">
          <MemberDialog space={space} />
          <UpdatePriceDialog />
          <MemberButton />
        </div>
      </div>

      {session && <ClaimShareRewards />}

      <div className="border-b">
        <Link href={Paths.posts} className={linkClassName(Paths.posts)}>
          Posts
        </Link>
        <Link href={Paths.members} className={linkClassName(Paths.members)}>
          Members
        </Link>

        {/* <Link href={Paths.sponsors} className={linkClassName(Paths.sponsors)}>
          Sponsors
        </Link> */}

        <Link href={Paths.trades} className={linkClassName(Paths.trades)}>
          Activities
        </Link>
      </div>
    </div>
  )
}
