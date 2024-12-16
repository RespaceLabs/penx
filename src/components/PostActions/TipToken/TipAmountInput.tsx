'use client'

import { PropsWithChildren, useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { matchNumber, toFloorFixed } from '@/lib/utils'

interface Props {
  cap: number
  value: string
  onChange: (value: string) => void
}

export function TipAmountInput({ cap, value, onChange }: Props) {
  const [index, setIndex] = useState('1')

  return (
    <div className="relative">
      <Input
        size="lg"
        autoFocus
        placeholder="0.0"
        value={value}
        onChange={(e) => {
          let value = e.target.value
          if ((e.nativeEvent as any)?.data === '。') {
            value = value.replace('。', '.')
          }
          if (!matchNumber(value, 18) && value.length) {
            if (/^\.\d+$/.test(value)) {
              onChange?.('0' + value)
              e.preventDefault()
            }

            return
          }
          setIndex('0')
          onChange(value)
        }}
        className="w-full"
      />

      <div className="flex items-center justify-center absolute right-0 top-0 h-full px-3">
        <ToggleGroup
          size="sm"
          value={index}
          onValueChange={(v) => {
            if (!v) return

            if (v === '1') onChange(toFloorFixed(cap * 0.1, 2).toString())
            if (v === '2') onChange(toFloorFixed(cap * 0.2, 2).toString())
            if (v === '3') onChange(toFloorFixed(cap * 0.5, 2).toString())
            if (v === '4') onChange(toFloorFixed(cap * 1, 2).toString())

            setIndex(v)
          }}
          type="single"
        >
          <ToggleItem value="1">10%</ToggleItem>
          <ToggleItem value="2">20%</ToggleItem>
          <ToggleItem value="3">50%</ToggleItem>
          <ToggleItem value="4">100%</ToggleItem>
        </ToggleGroup>
      </div>
    </div>
  )
}

function ToggleItem({ value, children }: PropsWithChildren<{ value: string }>) {
  return (
    <ToggleGroupItem
      value={value}
      className="h-8 w-12 bg-accent text-xs hover:bg-foreground/15 data-[state=on]:bg-black data-[state=on]:text-background rounded-full font-semibold"
    >
      {children}
    </ToggleGroupItem>
  )
}
