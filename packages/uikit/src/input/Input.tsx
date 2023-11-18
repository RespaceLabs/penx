import React, { FC, forwardRef } from 'react'
import { AtomicProps } from '@fower/atomic-props'
import { Box, Colors, FowerHTMLProps } from '@fower/react'
import { upFirst } from '@fower/utils'
import { Placement, useInputGroupContext } from './context'
import { Id } from './types'

type Size = 'sm' | 'md' | 'lg' | number

export interface InputProps extends Omit<FowerHTMLProps<'input'>, 'size'> {
  colorScheme?: keyof Colors

  size?: Size

  variant?: 'outline' | 'unstyled' | 'filled'
}

interface Attrs extends AtomicProps {
  [key: string]: any
}

function useStyles(props: InputProps, h: any) {
  // let attrs: Attrs = { rounded: true }
  let attrs: Attrs = {}
  const ctx = useInputGroupContext()

  // pure input, not with input group
  if (!ctx.placementMap) return attrs

  const { placementMap } = ctx
  const mapArr = Array.from(placementMap.values())
  const first = mapArr[0]
  const last = mapArr.pop()

  if (first.id === Id.InputElement) {
    attrs['pl--i'] = h
  }

  if (last?.id === Id.InputElement) {
    attrs['pr--i'] = h
  }

  if (first.id === Id.InputAddon) {
    attrs['roundedLeft--i'] = 0
  }

  if (last?.id === Id.InputAddon) {
    attrs['roundedRight--i'] = 0
  }

  attrs['zIndex--focus'] = 1

  // if (placement === Placement.middle) {
  //   attrs.borderLeft = 1
  // }

  // if (placement === Placement.start) {
  //   attrs.borderLeft = 1
  // }

  // if (placement === Placement.end) {
  //   attrs.borderRight = 1
  // }

  return attrs
}

interface Sizes {
  [key: string]: {
    h: number
    text: number
    px?: number
    rounded?: number
  }
}

function getSizeStyle(size: Size) {
  const sizes: Sizes = {
    sm: { px: 10, h: 32, text: 14, rounded: 6 },
    md: { px: 12, h: 40, text: 16, rounded: 8 },
    lg: { px: 14, h: 48, text: 18, rounded: 10 },
  }

  if (typeof size === 'string') return sizes[size]
  return {
    h: size,
    px: size * 0.35,
    text: size * 0.35,
    rounded: size * 0.2,
  }
}

export const Input = forwardRef<HTMLDivElement, InputProps>((props, ref) => {
  const {
    colorScheme = 'brand500',
    size = 'md',
    variant = 'outline',
    ...rest
  } = props
  const { disabled } = props
  const sizesStyle = getSizeStyle(size)
  const attrs = useStyles(props, sizesStyle.h)

  if (variant !== 'unstyled') {
    attrs[`border${upFirst(colorScheme)}--focus`] = true
  }

  const variants = {
    outline: {
      border: 1,
      'borderGray200--T30': true,
      'borderGray700--dark': true,
      'borderTransparent--dark--focus': true,
    },
    filled: {
      bgGray100: true,
      borderColor: 'transparent',
      'bgGray100--D4--hover': !disabled,
    },
    unstyled: {
      'shadow--focus': 'none',
      px: 0,
    },
  }

  return (
    <Box
      as="input"
      className="uikit-input"
      ref={ref}
      w-100p
      gray800
      bgTransparent--focus
      bgTransparent--dark
      outlineNone
      placeholderGray400
      opacity-40={!!disabled}
      cursorNotAllowed={!!disabled}
      transitionCommon
      duration-300
      {...sizesStyle}
      {...variants[variant]}
      {...(attrs as any)}
      {...rest}
    />
  )
})

Input.displayName = 'Input'
;(Input as any).id = 'Input'
