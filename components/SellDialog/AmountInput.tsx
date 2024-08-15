'use client'

import { Input } from '@/components/ui/input'
import { matchNumber } from '@/lib/utils'

interface Props {
  keyNum: string
  value: string
  onChange: (value: string) => void
}

export function AmountInput({ keyNum, value, onChange }: Props) {
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
          if (!matchNumber(value, 1) && value.length) {
            if (/^\.\d+$/.test(value)) {
              onChange?.('0' + value)
              e.preventDefault()
            }

            return
          }
          onChange(value)
        }}
        className="w-full"
      />

      <div className="flex items-center justify-center absolute right-0 top-0 h-full px-2">
        <div
          className="bg-muted py-1 px-3 rounded cursor-pointer text-sm"
          onClick={() => {
            onChange(keyNum)
          }}
        >
          Max
        </div>
      </div>
    </div>
  )
}
