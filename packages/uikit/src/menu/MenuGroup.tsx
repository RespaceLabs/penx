import React, { FC, forwardRef, ReactNode } from 'react'
import { Box, FowerHTMLProps } from '@fower/react'

export interface MenuGroupProps extends Omit<FowerHTMLProps<'div'>, 'title'> {
  title: ReactNode
}

export const MenuGroup = forwardRef<HTMLDivElement, MenuGroupProps>(
  function MenuGroup(props, ref) {
    const { title, children, ...rest } = props
    return (
      <Box className="uikit-menu-group" ref={ref} {...rest}>
        <Box toCenterY gray500 textXS minH8 px4>
          {title}
        </Box>
        {children}
      </Box>
    )
  },
)
