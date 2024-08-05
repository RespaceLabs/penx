'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { Separator } from '@/components/ui/separator'
import { trpc } from '@/lib/trpc'
import { Space } from '@prisma/client'
import Image from 'next/image'

interface Props {
  space: Space
}

export function PromotionCard({ space }: Props) {
  const { isLoading, data } = trpc.sponsor.getSponsorInSpace.useQuery({
    spaceId: space.id,
  })

  if (isLoading || !data) return null

  return (
    <div className="">
      {/* <Separator className="my-20"></Separator> */}
      <div
        className="flex items-center justify-between text-neutral-600 text-sm border border-slate-200/60 rounded-2xl p-4 cursor-pointer"
        onClick={() => {
          window.open(data.homeUrl, '_blank')
        }}
      >
        <div className="flex items-center space-x-2">
          <Image
            alt={data.name || ''}
            className="w-6 h-6 rounded"
            height={80}
            width={80}
            src={data.logo || ''}
          />
          <span className="font-bold">{data.name}:</span>
          <span>{data.description}</span>
        </div>

        <HoverCard openDelay={100}>
          <HoverCardTrigger>
            <Badge
              variant="outline"
              className="border-neutral-200 text-neutral-600 font-semibold"
            >
              Sponsored
            </Badge>
          </HoverCardTrigger>
          <HoverCardContent side="top">
            <a>Link to an external advertiser site</a>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  )
}
