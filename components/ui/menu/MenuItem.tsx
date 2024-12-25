import React, {
  DOMAttributes,
  FC,
  forwardRef,
  HTMLAttributes,
  PropsWithChildren,
} from 'react'
import { cn } from '@/lib/utils'
import { useMenuContext } from './context'

export interface MenuItemProps extends PropsWithChildren<HTMLAttributes<any>> {
  selected?: boolean
  disabled?: boolean
  className?: string
}

export const MenuItem = forwardRef<HTMLDivElement, MenuItemProps>(
  function MenuItem(props, ref) {
    const { selected, disabled, children, className, ...rest } = props

    return (
      <div
        ref={ref}
        className={cn(
          'px-3 py-2 max-h-9 flex flex-row items-center bg-background text-foreground text-sm transition-colors',
          disabled && 'cursor-not-allowed opacity-40 bg-foreground/10',
          !disabled && 'cursor-pointer',
          !disabled && !selected && 'hover:bg-foreground/10',
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    )
  },
)
