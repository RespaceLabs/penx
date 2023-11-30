import { forwardRef } from 'react'
import { Box, FowerHTMLProps } from '@fower/react'

interface MenuItemProps extends FowerHTMLProps<'div'> {
  disabled?: boolean
}

export const MenuItem = forwardRef<HTMLButtonElement, MenuItemProps>(
  function MenuItem({ children, disabled, ...props }, ref) {
    return (
      <Box
        {...props}
        className="MenuItem"
        ref={ref}
        role="menuitem"
        disabled={disabled}
        px3
        toCenterY
        outlineNone
        h-36
        cursorPointer
      >
        {children}
      </Box>
    )
  },
)

MenuItem.displayName = 'MenuItem'
;(MenuItem as any).isMenuItem = true
