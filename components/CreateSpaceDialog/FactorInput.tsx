'use client'

import { Input } from '@/components/ui/input'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

interface Props {
  value: string
  onChange: (value: string) => void
}

export function FactorInput({ value, onChange }: Props) {
  return (
    <div className="relative">
      <Input
        placeholder="0.0"
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
        }}
        className="w-full"
      />

      <div className="flex items-center justify-center absolute right-0 top-0 h-full px-3">
        <ToggleGroup
          size="sm"
          value={value}
          onValueChange={(v) => {
            if (!v) return
            if (v === '1') onChange('20000')
            if (v === '2') onChange('50000')
            if (v === '3') onChange('100000')
          }}
          type="single"
        >
          <ToggleGroupItem
            value="1"
            className="h-7 bg-accent text-xs hover:bg-neutral-200"
          >
            20000
          </ToggleGroupItem>
          <ToggleGroupItem
            value="2"
            className="h-7 bg-accent text-xs hover:bg-neutral-200"
          >
            50000
          </ToggleGroupItem>
          <ToggleGroupItem
            value="3"
            className="h-7 bg-accent text-xs hover:bg-neutral-200"
          >
            100000
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  )
}
