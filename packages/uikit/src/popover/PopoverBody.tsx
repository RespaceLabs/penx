import React, { FC } from 'react'
import { forwardRef } from '@bone-ui/utils'
import { Box, FowerHTMLProps } from '@fower/react'

export interface PopoverBodyProps extends FowerHTMLProps<'div'> {}

export const PopoverBody: FC<PopoverBodyProps> = forwardRef((props, ref) => {
  return (
    <Box
      ref={ref}
      className="bone-popover-body"
      px4
      py4
      leadingNormal
      {...props}
    ></Box>
  )
})
