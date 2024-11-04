import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

interface IOption {
  id: string
  name: string
  color: string
}

interface Props {
  option: IOption
  showClose?: boolean
  deletable?: boolean
  onDelete?: () => void
}

export function OptionTag({
  option,
  showClose = false,
  deletable = false,
  onDelete,
  ...rest
}: Props) {
  const color = option.color || 'gray600'
  return (
    <div
      key={option.id}
      className={cn(
        'optionTag relative inline-flex rounded-full px-2 h-8 gap-1 text-sm items-center justify-center cursor-pointer',
      )}
      // color={color}
      // bg--T90={color}
      {...rest}
    >
      <div>{option ? option.name : ''}</div>
      {deletable && (
        <div
          className="remove-option absolute -top-4 -right-4 flex items-center justify-center h-4 w-4 rounded-full text-white"
          // inlineFlex--$optionTag--hover
          // bg={color}
          // bg--T30--hover={color}
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
