import { ReactNode } from 'react'
import { matchNumber } from '@/lib/utils'

interface Props {
  symbolName?: string
  icon?: ReactNode
  disabled?: boolean
  value: string
  onChange: (value: string) => void
}

export const StakingInput = ({
  symbolName,
  icon,
  value,
  onChange,
  disabled = false,
}: Props) => {

  return <input
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
}
