import { forwardRef, PropsWithChildren } from 'react'
import { cn } from '../utils'

interface MenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean
}

export const MenuItem = forwardRef<
  HTMLButtonElement,
  PropsWithChildren<MenuItemProps>
>(function MenuItem({ children, disabled, ...props }, ref) {
  return (
    <div
      {...props}
      ref={ref as any}
      role="menuitem"
      className={cn(
        'MenuItem px-3 flex items-center h-12 cursor-pointer',
        disabled && 'cursor-not-allowed',
      )}
    >
      {children}
    </div>
  )
})

MenuItem.displayName = 'MenuItem'
;(MenuItem as any).isMenuItem = true
