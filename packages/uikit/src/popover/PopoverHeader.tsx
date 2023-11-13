import React, { FC, forwardRef, memo } from 'react'
import { Box, FowerHTMLProps } from '@fower/react'

export interface PopoverHeaderProps extends FowerHTMLProps<'header'> {}

export const PopoverHeader = memo(
  forwardRef<HTMLDivElement, PopoverHeaderProps>((props, ref) => {
    return (
      <Box
        ref={ref}
        as="header"
        className="uikit-popover-title"
        fontBold
        px-12
        py-12
        borderBottom-1
        borderBottomGray100--d4
        borderBottomGray700--dark
        {...props}
      ></Box>
    )
  }),
)
