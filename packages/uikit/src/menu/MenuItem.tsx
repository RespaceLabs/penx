import React, { FC, forwardRef } from 'react'
import { Box, FowerHTMLProps } from '@fower/react'
import { useMenuContext } from './context'

export interface MenuItemProps extends FowerHTMLProps<'div'> {
  selected?: boolean

  disabled?: boolean
}

export const MenuItem = forwardRef<HTMLDivElement, MenuItemProps>(
  function MenuItem(props, ref) {
    const { selected, disabled, children, ...rest } = props
    let { colorScheme } = useMenuContext()
    if (selected) rest.color = colorScheme

    return (
      <Box
        className="uikit-menu-item"
        ref={ref}
        px3
        py2
        minH9
        toCenterY
        bgWhite
        black
        textSM
        leadingNone
        transitionCommon
        duration-400
        bgGray800--dark
        gray100--dark
        gray800={!selected}
        cursorNotAllowed={!!disabled}
        opacity-40={!!disabled}
        cursorPointer={!disabled}
        bgGray100={!!selected}
        bgGray700--T20--dark={!!selected}
        bgGray100--T30--hover={!disabled && !selected}
        bgGray700--T20--dark--hover={!disabled && !selected}
        {...rest}
      >
        {children}
      </Box>
    )
  },
)
