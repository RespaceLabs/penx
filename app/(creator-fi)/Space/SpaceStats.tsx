'use client'

import { ReactNode } from 'react'
import { useSpaceContext } from '@/components/SpaceContext'
import { Skeleton } from '@/components/ui/skeleton'
import { useEthPrice } from '@/hooks/useEthPrice'
import { precision } from '@/lib/math'
import { useBalance } from 'wagmi'

interface Props {}

export function SpaceStats({}: Props) {
  const space = useSpaceContext()
  const { ethPrice } = useEthPrice()

  return (
    <div className="flex items-center justify-between gap-2">
      <StatsItem title="Total members" value={space.memberCount} />
      <StatsItem title="Total supply" value={`${space.totalSupplyFormatted}`} />
      <StatsItem
        title="Total volume"
        value={
          <div className="relative">
            <div>{space.getUsdVolume(ethPrice).usdVolumeFormatted}</div>
            <div className="absolute -bottom-4 flex shrink-0 gap-1 text-xs text-foreground/50 ">
              <div>{space.ethVolumeFormatted}</div>
              <div>ETH</div>
            </div>
          </div>
        }
      />
      <StatsItem title="Market cap" value={<MarketCap />} />
    </div>
  )
}

interface StatsItemProps {
  title: string
  value: ReactNode
}

function StatsItem({ title, value }: StatsItemProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs text-foreground/60">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  )
}

function MarketCap() {
  const space = useSpaceContext()
  const { data, isLoading } = useBalance({ address: space.address })
  const { ethPrice } = useEthPrice()
  if (isLoading || !data) return <Skeleton className="h-8"></Skeleton>
  const tvl = precision.toDecimal(data.value) * ethPrice
  return (
    <div className="relative">
      <div>${tvl.toFixed(2)}</div>
      <div className="absolute -bottom-4 flex shrink-0 gap-1 text-xs text-foreground/50">
        <div>{precision.toDecimal(data.value).toFixed(5)} </div>
        <div>ETH</div>
      </div>
    </div>
  )
}
