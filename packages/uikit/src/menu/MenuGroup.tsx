import React, { FC, ReactNode } from 'react'
import { forwardRef } from '@bone-ui/utils'
import { Box, FowerHTMLProps } from '@fower/react'

export interface MenuGroupProps extends Omit<FowerHTMLProps<'div'>, 'title'> {
  title: ReactNode
}

export const MenuGroup: FC<MenuGroupProps> = forwardRef(
  (props: MenuGroupProps, ref) => {
    const { title, children, ...rest } = props
    return (
      <Box className="bone-menu-group" ref={ref} {...rest}>
        <Box toCenterY gray500 textXS minH8 px4>
          {title}
        </Box>
        {children}
      </Box>
    )
  },
)
