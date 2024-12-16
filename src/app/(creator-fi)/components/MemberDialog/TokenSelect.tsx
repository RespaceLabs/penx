'use client'

import { forwardRef } from 'react'
import { useEthBalance } from '@/app/(creator-fi)/hooks/useEthBalance'
import { useTokenBalance } from '@/app/(creator-fi)/hooks/useTokenBalance'
import { useSpaceContext } from '@/components/SpaceContext'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { precision } from '@/lib/math'

interface Props {
  value: string
  onChange: (value: string) => void
}

export const TokenSelect = forwardRef<HTMLDivElement, Props>(
  function TokenSelect({ value, onChange }, ref) {
    const space = useSpaceContext()
    const { ethBalance } = useEthBalance()
    const { data } = useTokenBalance()
    const isEth = value === 'ETH'

    return (
      <div ref={ref} className="flex items-center">
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
              className="data-[state=on]:bg-black data-[state=on]:text-white text-xs font-semibold rounded-full h-8 border"
              value="ETH"
            >
              <div>$ETH</div>
            </ToggleGroupItem>

            <ToggleGroupItem
              value="SPACE"
              className="data-[state=on]:bg-black data-[state=on]:text-white text-xs font-semibold rounded-full h-8 border"
            >
              <div>${space.symbolName}</div>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {isEth && (
          <div className="text-xs text-foreground/60">
            {ethBalance.valueDecimal.toFixed(5)} ETH
          </div>
        )}

        {typeof data !== 'undefined' && !isEth && (
          <div className="text-xs text-foreground/60">
            {precision.toDecimal(data).toFixed(2)} {space.symbolName}
          </div>
        )}
      </div>
    )
  },
)
