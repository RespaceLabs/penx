import React, { forwardRef } from 'react'
import { As, Box, BoxComponent, FowerColor } from '@fower/react'
import { upFirst } from '@fower/utils'

type Size = 'sm' | 'md' | 'lg' | number

export interface ButtonProps {
  as?: As

  colorScheme?: FowerColor

  size?: Size

  isSquare?: boolean

  variant?: 'outline' | 'filled' | 'ghost' | 'light'

  disabled?: boolean

  children?: React.ReactNode
}

export const Button: BoxComponent<'button', ButtonProps> = forwardRef(
  function Button(props: ButtonProps, ref) {
    const {
      as = 'button',
      size = 'md',
      isSquare = false,
      colorScheme = 'brand500',
      variant = 'filled',
      disabled,
      children,
      ...rest
    } = props

    const sizeStyle = getSizeStyle(size, isSquare)

    const isFilled = variant === 'filled'

    const notAllowed = !!disabled

    return (
      <Box
        as={as}
        ref={ref}
        className="uikit-button"
        inlineFlex
        leadingNone
        toCenter
        outlineNone
        cursorPointer
        roundedMD
        appearanceNone
        selectNone
        gapX2
        transitionColors
        white--dark
        opacity-40={notAllowed}
        cursorNotAllowed={notAllowed}
        color={colorScheme}
        css={{
          whiteSpace: 'nowrap',
          verticalAlign: 'middle',
        }}
        {...getVariantStyle(colorScheme, notAllowed)[variant]}
        {...sizeStyle}
        {...rest}
        /** for white */
        {...(colorScheme === 'white'
          ? {
              border: true,
              borderGray200: true,
              bgWhite: true,
              'borderGray800--dark': true,
              'bgGray900--hover--dark--i': true,
              gray700: true,
              'gray400--dark': true,
              'gray400--dark--hover': true,
              'bgGray100--hover': !notAllowed && true,
              'black--hover': !notAllowed && true,
              'black--active': !notAllowed && true,
              'bgGray200--active': !notAllowed && true,
            }
          : {})}
        /** for black */
        {...(colorScheme === 'black' && variant === 'filled'
          ? {
              'bgGray700--hover': !notAllowed && true,
              'bgGray900--active': !notAllowed && true,
              'gray900--dark': true,
            }
          : {})}
        {...(colorScheme === 'black' && variant === 'outline'
          ? {
              'gray100--dark': !notAllowed && true,
              'white--dark--hover': !notAllowed && true,
              'borderGray300--dark--hover': !notAllowed && true,
              'borderGray400--dark': !notAllowed && true,
            }
          : {})}
      >
        {children}
      </Box>
    )
  },
) as any

function getVariantStyle(colorScheme: string, notAllowed: any = null): any {
  const light: any = { 'bg--T90': colorScheme, borderColor: colorScheme }
  const filled: any = { white: true, bg: colorScheme }
  const ghost: any = { bgTransparent: true }

  const outline: any = {
    border: 1,
    borderColor: colorScheme,
    bgTransparent: true,
    'color--dark': colorScheme,
    'color--hover--dark--D10': colorScheme,
  }

  const Color = upFirst(colorScheme)

  /**
   * hover must be after active
   * @see https://stackoverflow.com/questions/23534266/aactive-is-not-working-while-ahover-is-working-well
   *   */
  if (!notAllowed) {
    light[`bg${Color}--T65--active`] = true
    light[`${colorScheme}--D10--active`] = true
    light[`bg${Color}--T75--hover`] = true

    filled[`bg${Color}--D26--active`] = true
    filled[`bg${Color}--D10--hover`] = true

    ghost[`bg${Color}--T65--active`] = true
    ghost[`bg${Color}--T85--hover`] = true

    outline[`bg${Color}--D20--active`] = true
    outline[`bg${Color}--hover`] = true
    outline['color--hover'] = 'white'
  }
  const styles = { light, filled, ghost, outline }
  return styles
}

interface Sizes {
  [key: string]: {
    h: number
    text: number
    px?: number
    rounded?: number
  }
}

function getSizeStyle(size: Size, isSquare: boolean): Sizes {
  const sizes: Sizes = {
    sm: { h: 32, text: 12, px: 16, rounded: 6 },
    md: { h: 40, text: 14, px: 20, rounded: 8 },
    lg: { h: 48, text: 16, px: 24, rounded: 10 },
  }
  let style: any = {}
  if (typeof size === 'string') {
    style = sizes[size]
  } else {
    style = {
      h: size,
      px: size * 0.5,
      text: size * 0.35,
      rounded: size * 0.2,
    }
  }

  if (isSquare) {
    style.w = style.h
    style.px = false
    style.py = false
  }
  return style
}
