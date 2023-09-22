import React, { FC, memo } from 'react'
import { forwardRef } from '@bone-ui/utils'
import { Box, FowerHTMLProps } from '@fower/react'
import { PopoverTrigger } from '../popover'
import { useSelectContext } from './context'

export interface SelectTriggerProps extends FowerHTMLProps<'div'> {
  loading?: boolean
}

export const SelectTrigger: FC<SelectTriggerProps> = memo(
  forwardRef((props: SelectTriggerProps, ref) => {
    const { height } = useSelectContext()
    const { loading, ...rest } = props
    const { selectedItem } = useSelectContext()

    return (
      <PopoverTrigger h-100p asChild>
        {({ isOpen }) => {
          return (
            <Box
              ref={ref}
              className="bone-ui-select-trigger"
              toBetween
              toCenterY
              px3
              gapX1
              leadingNone
              cursorPointer
              rounded-8
              bgNeutralsBackground
              h={height}
              {...rest}
            >
              {props.children}
            </Box>
          )
        }}
      </PopoverTrigger>
    )
  }),
)
