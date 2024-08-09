import { HTMLAttributes, Suspense } from 'react'
import { BuyDialog } from '@/components/BuyDialog/BuyDialog'
import { CurveButton } from '@/components/curve/CurveButton'
import { CurveDialog } from '@/components/curve/CurveDialog'
import { InitBuySellDialog } from '@/components/InitBuySellDialog'
import { SellDialog } from '@/components/SellDialog/SellDialog'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { Space } from '@prisma/client'
import Image from 'next/image'
import { CurationCard } from '../../[slug]/CurationCard'
import { BuyButton } from './BuyButton'
import { KeyStats } from './KeyStats/KeyStats'
import { MemberAvatarList } from './MemberAvatarList'
import { SellButton } from './SellButton'
import { SponsorAvatarList } from './SponsorAvatarList'

interface Props extends HTMLAttributes<any> {
  space: Space
}

export function SpaceSidebar({ space, className }: Props) {
  return (
    <>
      <InitBuySellDialog space={space} creationId={space.creationId!} />

      <div className={cn('w-[360px] max-h-[100vh] pl-10 mt-10', className)}>
        <div className="flex flex-col gap-2">
          <Image
            alt={space.name || ''}
            className="w-24 h-24 rounded-full"
            height={80}
            width={80}
            src={space.logo || ''}
          />
          <div className="font-semibold text-lg">{space.name}</div>
          <div className="text-sm text-secondary-foreground">
            {space.description}
          </div>
        </div>
        <div className="flex gap-2 my-4">
          <BuyButton></BuyButton>
          <SellButton></SellButton>
          <Suspense fallback="">
            <CurveDialog space={space} />
          </Suspense>
        </div>
        <CurationCard space={space} />

        <div className="grid gap-5">
          <KeyStats space={space} />
          <MemberAvatarList spaceId={space.id} />
          <SponsorAvatarList spaceId={space.id} />
        </div>
      </div>
    </>
  )
}
