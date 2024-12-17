'use client'

import { Input } from '@/components/ui/input'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { NumberInput } from '../NumberInput'

interface Props {
  value: string
  onChange: (value: string) => void
}

export function PointInput({ value, onChange }: Props) {
  return (
    <div className="relative">
      <NumberInput
        precision={1}
        placeholder="0.0"
        value={value}
        onChange={(v) => {
          onChange(v)
        }}
        className="w-full"
      />

      <div className="flex items-center justify-center absolute right-0 top-0 h-full px-3">
        <ToggleGroup
          size="sm"
          value={value}
          onValueChange={(v) => {
            if (!v) return
            if (v === '1') onChange('50')
            if (v === '2') onChange('100')
            if (v === '3') onChange('200')
          }}
          type="single"
        >
          <ToggleGroupItem
            value="1"
            className="h-7 bg-accent text-xs hover:bg-foreground/20"
          >
            50
          </ToggleGroupItem>
          <ToggleGroupItem
            value="2"
            className="h-7 bg-accent text-xs hover:bg-foreground/20"
          >
            100
          </ToggleGroupItem>
          <ToggleGroupItem
            value="3"
            className="h-7 bg-accent text-xs hover:bg-foreground/20"
          >
            200
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  )
}
