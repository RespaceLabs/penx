import React, { FC, memo } from 'react'
import { forwardRef } from '@bone-ui/utils'
import { Box, FowerHTMLProps } from '@fower/react'

export interface PopoverHeaderProps extends FowerHTMLProps<'header'> {}

export const PopoverHeader: FC<PopoverHeaderProps> = memo(
  forwardRef((props, ref) => {
    return (
      <Box
        ref={ref}
        as="header"
        className="bone-popover-title"
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
