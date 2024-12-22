import { X } from 'lucide-react'
import { getBgColor } from '@/lib/color-helper'
import { cn } from '@/lib/utils'

interface IOption {
  id: string
  name: string
  color: string
}

interface Props {
  option: IOption
  showClose?: boolean
  deletable?: boolean
  className?: string
  onDelete?: () => void
}

export function OptionTag({
  option,
  className,
  showClose = false,
  deletable = false,
  onDelete,
}: Props) {
  const color = option.color

  return (
    <div
      key={option.id}
      className={cn(
        'optionTag relative inline-flex rounded-full px-2 py-1 gap-1 text-sm items-center justify-center cursor-pointer text-white',
        getBgColor(color),
        className,
      )}
    >
      <div>{option ? option.name : ''}</div>
      {deletable && (
        <div
          className="remove-option absolute -top-1 -right-1 flex items-center justify-center h-4 w-4 rounded-full text-background bg-brand-500"
          onClick={(e) => {
            e.stopPropagation()
            onDelete?.()
          }}
        >
          <X size={12}></X>
        </div>
      )}

      {showClose && (
        <div className="inline-flex">
          <X size={12}></X>
        </div>
      )}
    </div>
  )
}
