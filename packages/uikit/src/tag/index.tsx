import React, { cloneElement } from 'react'
import { forwardRef } from '@bone-ui/utils'
import { As, Box, BoxComponent, FowerColor, store } from '@fower/react'

export interface TagProps {
  as?: As

  colorScheme?: FowerColor

  variant?: 'outline' | 'filled' | 'light'

  size?: Size

  icon?: React.ReactElement

  children?: string | React.ReactNode
}

type Size = 'sm' | 'md' | 'lg' | number

export const Tag: BoxComponent<'div', TagProps> = forwardRef(
  (props: TagProps, ref) => {
    const {
      as = 'div',
      variant = 'filled',
      colorScheme = 'brand500',
      size = 'sm',
      icon,
      children,
      ...rest
    } = props

    const sizeStyle = getSizeStyle(size)
    const colors: any = store.theme.colors
    const color = colors[colorScheme]

    const isStringChildren = typeof children === 'string'

    return (
      <Box
        as={as}
        className="bone-tag"
        ref={ref}
        inlineFlex
        toCenter
        roundedFull
        leadingNone
        color={colorScheme}
        spaceX1={!!icon}
        css={{
          whiteSpace: 'nowrap',
        }}
        {...getVariantStyle(color)[variant]}
        {...sizeStyle}
        {...rest}
      >
        {icon && cloneElement(icon, { square: sizeStyle.text })}
        {isStringChildren && <Box as="span">{children}</Box>}
        {!isStringChildren && children}
      </Box>
    )
  },
)

function getVariantStyle(color: string): any {
  const light: any = { 'bg--T85': color, borderColor: color }
  const filled: any = { white: true, bg: color }
  const outline: any = { border: true, borderColor: color, bgTransparent: true }

  const styles = { light, filled, outline }
  return styles
}

function getSizeStyle(size: Size) {
  const sizes = {
    sm: { h: 24, text: 12, px: 8 },
    md: { h: 28, text: 14, px: 12 },
    lg: { h: 32, text: 16, px: 14 },
  }
  if (typeof size === 'string') return sizes[size]
  return { h: size, px: size * 0.6, text: size * 0.5 }
}
