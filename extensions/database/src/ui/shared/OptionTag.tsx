import { Box, FowerHTMLProps } from '@fower/react'
import { X } from 'lucide-react'
import { IOptionNode } from '@penx/model-types'

interface Props extends Omit<FowerHTMLProps<'div'>, 'children'> {
  option: IOptionNode
  deletable?: boolean
  onDelete?: () => void
}
export function OptionTag({
  option,
  deletable = false,
  onDelete,
  ...rest
}: Props) {
  return (
    <Box
      key={option.id}
      className="optionTag"
      relative
      inlineFlex
      roundedFull
      px2
      py1
      gap1
      textSM
      toCenterY
      cursorPointer
      color={option?.props.color}
      bg--T90={option?.props.color}
      {...rest}
    >
      <Box>{option ? option.props.name : ''}</Box>
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
          bg={option?.props.color}
          bg--T30--hover={option?.props.color}
          white
          onClick={(e) => {
            e.stopPropagation()
            onDelete?.()
          }}
        >
          <X size={12}></X>
        </Box>
      )}
    </Box>
  )
}
