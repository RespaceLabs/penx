'use client'

import { PropsWithChildren, useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Subscription } from '@/domains/Subscription'
import { useSubscription } from '@/hooks/useSubscription'
import { matchNumber, toFloorFixed } from '@/lib/utils'

interface Props {
  isSubscribe: boolean
  value: string
  onChange: (value: string) => void
}

export function AmountInput({ isSubscribe, value, onChange }: Props) {
  const [index, setIndex] = useState('2')
  const { subscription, data } = useSubscription()

  useEffect(() => {
    if (isSubscribe) {
      onChange('180')
      return
    }
    if (!data) return
    const subscription = new Subscription(data!)
    onChange(subscription.daysFormatted.toString())
    setIndex('3')
  }, [isSubscribe, data])

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
          if (!matchNumber(value, 2) && value.length) {
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
        {isSubscribe && (
          <ToggleGroup
            size="sm"
            value={index}
            onValueChange={(v) => {
              if (!v) return
              if (v === '1') onChange('30')
              if (v === '2') onChange('180')
              if (v === '3') onChange('356')

              setIndex(v)
            }}
            type="single"
          >
            <ToggleItem value="1">30</ToggleItem>
            <ToggleItem value="2">180</ToggleItem>
            <ToggleItem value="3">356</ToggleItem>
          </ToggleGroup>
        )}
        {!isSubscribe && (
          <ToggleGroup
            size="sm"
            value={index}
            onValueChange={(v) => {
              if (!v) return
              const days = subscription.daysDecimal

              if (v === '1') onChange(toFloorFixed(days * 0.1, 2).toString())
              if (v === '2') onChange(toFloorFixed(days * 0.5, 2).toString())
              if (v === '3') onChange(subscription.daysFormatted.toString())

              setIndex(v)
            }}
            type="single"
          >
            <ToggleItem value="1">10%</ToggleItem>
            <ToggleItem value="2">50%</ToggleItem>
            <ToggleItem value="3">100%</ToggleItem>
          </ToggleGroup>
        )}
      </div>
    </div>
  )
}

function ToggleItem({ value, children }: PropsWithChildren<{ value: string }>) {
  return (
    <ToggleGroupItem
      value={value}
      className="h-8 w-12 bg-accent text-xs hover:bg-neutral-200 data-[state=on]:bg-black data-[state=on]:text-white rounded-full font-semibold"
    >
      {children}
    </ToggleGroupItem>
  )
}
