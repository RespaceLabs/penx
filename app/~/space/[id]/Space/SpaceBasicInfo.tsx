'use client'

import { Badge } from '@/components/ui/badge'
import { useSpace } from '@/hooks/useSpace'
import { useSession } from 'next-auth/react'
import Image from 'next/image'

interface Props {}

export function SpaceBasicInfo({}: Props) {
  const { data: session } = useSession()
  const { space } = useSpace()
  const isOwner = session?.userId === space?.userId

  return (
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
        </div>
        <div className="text-sm text-secondary-foreground">
          {space.description || 'No description yet.'}
        </div>
      </div>
    </div>
  )
}
