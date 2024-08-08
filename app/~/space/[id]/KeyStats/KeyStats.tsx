'use client'

import { PropsWithChildren } from 'react'
import { useCreation } from '@/hooks/useCreation'
import { RouterOutputs } from '@/server/_app'
import { KeyBalance } from './KeyBalance'
import { KeyPrice } from './KeyPrice'
import { KeySupply } from './KeySupply'
import { TVL } from './TVL'

interface Props {
  space: RouterOutputs['space']['byId']
}

function StatsCard({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col flex-1 justify-start items-start gap-2 shadow rounded-lg p-4 border border-zinc-100">
      {children}
    </div>
  )
}

export function KeyStats({ space }: Props) {
  const { creation } = useCreation()
  if (!creation) return null

  return (
    <div className="flex justify-between gap-3">
      <StatsCard>
        <div className="text-neutral-900 text-sm">Key Price</div>
        <div className="text-2xl font-semibold">
          <KeyPrice creation={creation} />
        </div>
      </StatsCard>
      <StatsCard>
        <div className="text-neutral-900 text-sm">My Holdings</div>
        <div className="text-2xl font-semibold">
          <KeyBalance creation={creation} />
        </div>
      </StatsCard>
      <StatsCard>
        <div className="text-neutral-900 text-sm">Key Supply</div>
        <div className="text-2xl font-semibold">
          <KeySupply creation={creation} />
        </div>
      </StatsCard>

      <StatsCard>
        <div className="text-neutral-900 text-sm">Total Value</div>
        <div className="text-2xl font-semibold">
          <TVL creation={creation} />
        </div>
      </StatsCard>
    </div>
  )
}
