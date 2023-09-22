import React, { FC } from 'react'
import { forwardRef } from '@bone-ui/utils'
import { Box, FowerHTMLProps } from '@fower/react'
import { MenuContext, MenuProvider } from './context'

export interface MenuProps extends MenuContext, FowerHTMLProps<'div'> {}

export const Menu: FC<MenuProps> = forwardRef((props: MenuProps, ref) => {
  const { colorScheme = 'brand500', ...rest } = props
  return (
    <MenuProvider value={{ colorScheme }}>
      <Box
        className="bone-menu"
        ref={ref}
        bgWhite
        minW-140
        rounded
        overflowHidden
        shadow
        {...rest}
      />
    </MenuProvider>
  )
})
