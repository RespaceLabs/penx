import React, { forwardRef } from 'react'
import { Box, FowerHTMLProps } from '@fower/react'

export interface PopoverBodyProps extends FowerHTMLProps<'div'> {}

export const PopoverBody = forwardRef<HTMLDivElement, PopoverBodyProps>(
  function PopoverBodyProps(props, ref) {
    return (
      <Box
        ref={ref}
        className="uikit-popover-body"
        px4
        py4
        leadingNormal
        {...props}
      ></Box>
    )
  },
)
