import { ReactNode } from 'react'
import { matchNumber } from '@/lib/utils'

interface Props {
  symbolName: string
  icon: ReactNode
  disabled?: boolean
  value: string
  onChange: (value: string) => void
}

export const AmountInput = ({ symbolName, icon, value, onChange, disabled = false }: Props) => {
  return (
    <div className="flex h-9 items-center gap-1">
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
        className="h-full w-full border-none bg-transparent  pl-0 text-2xl font-bold text-black dark:text-zinc-200 outline-none focus:border-none focus:outline-none focus:ring-0"
      />
      {icon}
      <span className="text-lg font-semibold">{symbolName}</span>
    </div>
  )
}
