'use client'

import { CurveDialog } from '@/components/curve/CurveDialog'
import { InitBuySellDialog } from '@/components/InitBuySellDialog'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { Space } from '@prisma/client'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { KeyStats } from '../KeyStats/KeyStats'
import { BuyButton } from './BuyButton'
import { SellButton } from './SellButton'

interface Props {
  space: Space
  isLoading: boolean
}

export function SpaceInfo({ space, isLoading }: Props) {
  const pathname = usePathname()

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

  const url = `${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/@${space.subdomain}`
  return (
    <div className="grid gap-6">
      <div className="flex  justify-between w-full">
        <div className="flex items-center gap-2">
          <Image
            alt={space.name || ''}
            className=" w-20 h-20 rounded-full"
            height={80}
            width={80}
            src={space.logo || ''}
          />

          <div className="grid gap-1">
            <div className="flex items-center gap-2">
              <div className="font-semibold text-lg">{space.name}</div>
              <a
                href={`/@${space.subdomain}`}
                target="_blank"
                rel="noreferrer"
                className="truncate rounded-md bg-stone-100 px-2 py-1 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200 "
              >
                {url} ↗
              </a>
            </div>
            <div className="text-sm text-secondary-foreground">
              {space.description || 'No description yet.'}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <CurveDialog space={space} />
          <SellButton></SellButton>
          <BuyButton></BuyButton>
        </div>
        <InitBuySellDialog space={space} creationId={space.creationId!} />
      </div>
      <KeyStats space={space} />
      <div className="border-b">
        <Link href={Paths.posts} className={linkClassName(Paths.posts)}>
          Posts
        </Link>
        <Link href={Paths.members} className={linkClassName(Paths.members)}>
          Members
        </Link>
        <Link href={Paths.sponsors} className={linkClassName(Paths.sponsors)}>
          Sponsors
        </Link>
        <Link href={Paths.trades} className={linkClassName(Paths.trades)}>
          Trades
        </Link>
      </div>
    </div>
  )
}
