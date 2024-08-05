'use client'

import { useCreation } from '@/hooks/useCreation'
import { useSpaces } from '@/hooks/useSpaces'
import { RouterOutputs } from '@/server/_app'
import { Space } from '@prisma/client'
import { KeyBalance } from './KeyBalance'
import { KeyPrice } from './KeyPrice'
import { KeySupply } from './KeySupply'
import { TVL } from './TVL'

interface Props {
  space: RouterOutputs['space']['byId']
}

export function KeyStats({ space }: Props) {
  const { creation } = useCreation()
  if (!creation) return null

  return (
    <div className="flex justify-between">
      <div className="flex flex-col">
        <div className="text-neutral-900 text-sm">Key Price</div>
        <div className="text-2xl font-semibold">
          <KeyPrice creation={creation} />
        </div>
      </div>

      <div className="flex flex-col">
        <div className="text-neutral-900 text-sm">My Holdings</div>
        <div className="text-2xl font-semibold">
          <KeyBalance creation={creation} />
        </div>
      </div>

      <div className="flex flex-col">
        <div className="text-neutral-900 text-sm">Key Supply</div>
        <div className="text-2xl font-semibold">
          <KeySupply creation={creation} />
        </div>
      </div>

      <div className="flex flex-col">
        <div className="text-neutral-900 text-sm">Total Value</div>
        <div className="text-2xl font-semibold">
          <TVL creation={creation} />
        </div>
      </div>
    </div>
  )
}
