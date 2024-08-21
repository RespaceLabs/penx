import { ReactNode } from 'react'
import { matchNumber } from '@/lib/utils'

interface Props {
  symbolName: string
  icon: ReactNode
  disabled?: boolean
  value: string
  onChange: (value: string) => void
}

export const AmountInput = ({
  symbolName,
  icon,
  value,
  onChange,
  disabled = false,
}: Props) => {
  return (
    <div className="flex items-center gap-1 h-9">
      <input
        type="text"
        value={value}
        disabled={disabled}
        onChange={(e) => {
          let value = e.target.value
          if ((e.nativeEvent as any)?.data === '。') {
            value = value.replace('。', '.')
          }

          if (!matchNumber(value, 8) && value.length) {
            if (/^\.\d+$/.test(value)) {
              onChange?.('0' + value)
              e.preventDefault()
            }
            return
          }
          onChange(e.target.value)
        }}
        placeholder="0.0"
        className="font-bold text-2xl text-black pl-0  w-full border-none focus:border-none outline-none bg-transparent h-full"
      />
      {icon}
      <span className="text-lg font-semibold">{symbolName}</span>
    </div>
  )
}
