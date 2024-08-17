import { HTMLAttributes, Suspense } from 'react'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { Space } from '@prisma/client'
import Image from 'next/image'
import { CurationCard } from '../../[slug]/CurationCard'
import { MemberAvatarList } from './MemberAvatarList'
import { SponsorAvatarList } from './SponsorAvatarList'

interface Props extends HTMLAttributes<any> {
  space: Space
}

export function SpaceSidebar({ space, className }: Props) {
  return (
    <>
      <div className={cn('w-[360px] max-h-[100vh] pl-10 mt-10', className)}>
        <div className="flex flex-col gap-2">
          <Image
            alt={space.name || ''}
            className="w-24 h-24 rounded-full"
            height={80}
            width={80}
            src={
              space.logo ||
              'https://public.blob.vercel-storage.com/eEZHAoPTOBSYGBE3/JRajRyC-PhBHEinQkupt02jqfKacBVHLWJq7Iy.png'
            }
          />
          <div className="font-semibold text-lg">{space.name}</div>
          <div className="text-sm text-secondary-foreground">
            {space.description}
          </div>
        </div>
        <CurationCard space={space} />

        <div className="grid gap-5">
          <MemberAvatarList spaceId={space.id} />
          {/* <SponsorAvatarList spaceId={space.id} /> */}
        </div>
      </div>
    </>
  )
}
