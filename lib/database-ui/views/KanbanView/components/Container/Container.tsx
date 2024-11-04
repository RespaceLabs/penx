import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Handle, Remove } from '../Item'
import styles from './Container.module.scss'

export interface Props {
  children: React.ReactNode
  label?: string
  color?: string
  style?: React.CSSProperties
  horizontal?: boolean
  hover?: boolean
  items: string[]
  handleProps?: React.HTMLAttributes<any>
  scrollable?: boolean
  shadow?: boolean
  placeholder?: boolean
  onClick?(): void
  onRemove?(): void
}

export const Container = forwardRef<HTMLDivElement, Props>(function Container(
  {
    children,
    handleProps,
    horizontal,
    hover,
    onClick,
    onRemove,
    label,
    items,
    placeholder,
    scrollable,
    shadow,
    ...props
  }: Props,
  ref,
) {
  return (
    <div
      {...props}
      ref={ref as any}
      className={cn(
        styles.Container,
        horizontal && styles.horizontal,
        hover && styles.hover,
        placeholder && styles.placeholder,
        scrollable && styles.scrollable,
        shadow && styles.shadow,
        'min-w-[270px] overflow-hidden bg-foreground/10 m-2 rounded-lg',
      )}
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
    >
      {label ? (
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div
              // bg--T60={props.color}
              className="rounded-full px-2 h-6 text-sm flex items-center justify-center"
            >
              {label}
            </div>
            <div>{items?.length}</div>
          </div>
          <div className="flex items-center">
            {onRemove ? <Remove onClick={onRemove} /> : undefined}
            <Handle {...handleProps} />
          </div>
        </div>
      ) : null}
      {placeholder ? (
        children
      ) : (
        <div className="flex flex-col gap-2 p-2">{children}</div>
      )}
    </div>
  )
})
