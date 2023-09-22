import React, { FC, memo } from 'react'
import { forwardRef } from '@bone-ui/utils'
import { Box, FowerHTMLProps } from '@fower/react'

export interface PopoverFooterProps extends FowerHTMLProps<'footer'> {}

export const PopoverFooter: FC<PopoverFooterProps> = memo(
  forwardRef((props, ref) => {
    return (
      <Box
        ref={ref}
        as="footer"
        className="bone-popover-footer"
        px-12
        py-12
        borderTop-1
        borderGray100--D4
        {...props}
      ></Box>
    )
  }),
)
