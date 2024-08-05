'use client'

import { useCreation } from '@/hooks/useCreation'
import { RouterOutputs } from '@/server/_app'
import { KeyBalance } from './KeyBalance'
import { KeyPrice } from './KeyPrice'
import { KeySupply } from './KeySupply'
import { TVL } from './TVL'

interface Props {
  space: RouterOutputs['space']['byId']
}

export function KeyStats({}: Props) {
  const { creation } = useCreation()

  if (!creation) return null

  return (
    <div className="flex flex-col justify-between mt-4">
      <div className="text-lg font-semibold">Stats</div>
      <div className="flex justify-between">
        <div className="text-neutral-900 text-sm">Key Price</div>
        <div className="text-base font-semibold">
          <KeyPrice creation={creation} />
        </div>
      </div>

      <div className="flex justify-between">
        <div className="text-neutral-900 text-sm">My Holdings</div>
        <div className="text-base font-semibold">
          <KeyBalance creation={creation} />
        </div>
      </div>

      <div className="flex justify-between">
        <div className="text-neutral-900 text-sm">Key Supply</div>
        <div className="text-base font-semibold">
          <KeySupply creation={creation} />
        </div>
      </div>

      <div className="flex justify-between">
        <div className="text-neutral-900 text-sm">Total Value</div>
        <div className="text-base font-semibold">
          <TVL creation={creation} />
        </div>
      </div>
    </div>
  )
}
