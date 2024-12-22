import React, { FC, forwardRef } from 'react'
import { Box, FowerHTMLProps } from '@fower/react'
import { MenuContext, MenuProvider } from './context'

export interface MenuProps extends MenuContext, FowerHTMLProps<'div'> {}

export const Menu = forwardRef<HTMLDivElement, MenuProps>(function MenuProps(
  props: MenuProps,
  ref,
) {
  const { colorScheme = 'brand500', ...rest } = props
  return (
    <MenuProvider value={{ colorScheme }}>
      <Box
        className="uikit-menu"
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
