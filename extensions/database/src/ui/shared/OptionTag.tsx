import { Box, FowerHTMLProps } from '@fower/react'
import { X } from 'lucide-react'

interface IOption {
  id: string
  name: string
  color: string
}

interface Props extends Omit<FowerHTMLProps<'div'>, 'children'> {
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
    <Box
      key={option.id}
      className="optionTag"
      relative
      inlineFlex
      roundedFull
      px2
      h-24
      gap1
      textSM
      toCenterY
      toBetween
      cursorPointer
      color={color}
      bg--T90={color}
      {...rest}
    >
      <Box>{option ? option.name : ''}</Box>
      {deletable && (
        <Box
          className="remove-option"
          absolute
          top--4
          right--4
          toCenter
          hidden
          circle4
          inlineFlex--$optionTag--hover
          bg={color}
          bg--T30--hover={color}
          white
          onClick={(e) => {
            e.stopPropagation()
            onDelete?.()
          }}
        >
          <X size={12}></X>
        </Box>
      )}

      {showClose && (
        <Box inlineFlex>
          <X size={12}></X>
        </Box>
      )}
    </Box>
  )
}
