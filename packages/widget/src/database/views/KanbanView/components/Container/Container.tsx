import React, { forwardRef } from 'react'
import { Box } from '@fower/react'
import classNames from 'classnames'
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
    <Box
      {...props}
      ref={ref as any}
      className={classNames(
        styles.Container,
        horizontal && styles.horizontal,
        hover && styles.hover,
        placeholder && styles.placeholder,
        scrollable && styles.scrollable,
        shadow && styles.shadow,
      )}
      minW-270
      overflowHidden
      bgNeutral100
      m2
      roundedLG
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
    >
      {label ? (
        <Box toCenterY toBetween px2>
          <Box toCenterY gap2>
            <Box bg--T60={props.color} roundedFull px2 h-24 textSM toCenter>
              {label}
            </Box>
            <Box>{items?.length}</Box>
          </Box>
          <Box toCenterY>
            {onRemove ? <Remove onClick={onRemove} /> : undefined}
            <Handle {...handleProps} />
          </Box>
        </Box>
      ) : null}
      {placeholder ? (
        children
      ) : (
        <Box column gap2 p2>
          {children}
        </Box>
      )}
    </Box>
  )
})
