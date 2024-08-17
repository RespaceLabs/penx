'use client'

import { forwardRef } from 'react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useEthBalance } from '@/hooks/useEthBalance'
import { useSpaces } from '@/hooks/useSpaces'
import { useTokenBalance } from '@/hooks/useTokenBalance'
import { precision } from '@/lib/math'

interface Props {
  value: string
  onChange: (value: string) => void
}

export const TokenSelect = forwardRef(function TokenSelect({
  value,
  onChange,
}: Props) {
  const { space } = useSpaces()
  const { ethBalance } = useEthBalance()
  const { data } = useTokenBalance()
  const isEth = value === 'ETH'

  return (
    <div className="flex items-center">
      <div className="w-10">Use</div>
      <div className="flex-1">
        <ToggleGroup
          className="gap-3"
          value={value}
          onValueChange={(v) => {
            if (!v) return
            onChange(v)
          }}
          type="single"
        >
          <ToggleGroupItem
            className="data-[state=on]:bg-black data-[state=on]:text-white text-xs font-semibold w-16 rounded-full h-8 border"
            value="ETH"
          >
            <div>$ETH</div>
          </ToggleGroupItem>

          <ToggleGroupItem
            value="SPACE"
            className="data-[state=on]:bg-black data-[state=on]:text-white text-xs font-semibold w-16 rounded-full h-8 border"
          >
            <div>${space.symbolName}</div>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {isEth && (
        <div className="text-xs text-neutral-500">
          {ethBalance.valueDecimal.toFixed(5)} ETH
        </div>
      )}

      {!!data && !isEth && (
        <div className="text-xs text-neutral-500">
          {precision.toDecimal(data).toFixed(2)} {space.symbolName}
        </div>
      )}
    </div>
  )
})
