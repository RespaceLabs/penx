'use client'

import { MemberDialog } from '@/components/MemberDialog/MemberDialog'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { UpdatePriceDialog } from '@/components/UpdatePriceDialog/UpdatePriceDialog'
import { useSpace } from '@/hooks/useSpace'
import { cn } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ClaimShareRewards } from './ClaimShareRewards'
import { MemberButton } from './MemberButton'

interface Props {}

export function SpaceInfo({}: Props) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { isLoading, space } = useSpace()
  const isOwner = session?.userId === space?.userId

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
            src={
              space.logo ||
              'https://public.blob.vercel-storage.com/eEZHAoPTOBSYGBE3/JRajRyC-PhBHEinQkupt02jqfKacBVHLWJq7Iy.png'
            }
          />

          <div className="grid gap-1">
            <div className="flex items-center gap-2">
              <div className="font-semibold text-lg">{space.name}</div>
              <Badge variant="secondary">{isOwner ? 'Owner' : 'Member'}</Badge>
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
        <div className="">
          <div className="flex gap-2">
            <MemberDialog space={space} />
            <UpdatePriceDialog />
            <MemberButton />
          </div>
        </div>
      </div>

      {session?.userId === space.userId && <ClaimShareRewards />}

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
