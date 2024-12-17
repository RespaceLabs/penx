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
      className="optionTag relative inline-flex rounded-full px-2 py-1 gap-1 text-sm items-center justify-between cursor-pointer"
      // color={color}
      // bg--T90={color}
      {...rest}
    >
      <div>{option ? option.name : ''}</div>
      {deletable && (
        <div
          // inlineFlex--$optionTag--hover
          // bg={color}
          // bg--T30--hover={color}
          className="remove-option text-background absolute -top-1 -right-1 flex items-center w-4 h-4 rounded-full transition-all"
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
