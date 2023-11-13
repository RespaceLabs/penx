import React, { forwardRef, memo } from 'react'
import { Box, FowerHTMLProps } from '@fower/react'

export interface PopoverFooterProps extends FowerHTMLProps<'footer'> {}

export const PopoverFooter = memo(
  forwardRef<HTMLDivElement, PopoverFooterProps>((props, ref) => {
    return (
      <Box
        ref={ref}
        as="footer"
        className="uikit-popover-footer"
        px-12
        py-12
        borderTop-1
        borderGray100--D4
        {...props}
      ></Box>
    )
  }),
)
