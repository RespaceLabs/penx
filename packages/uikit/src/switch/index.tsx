import React, { FC, forwardRef, memo } from 'react'
import { Box, FowerColor, FowerHTMLProps } from '@fower/react'
import { Checkbox } from '../checkbox'

type Size = 'sm' | 'md' | 'lg' | number

function formatSize(size: any): number {
  const maps: any = { sm: 16, md: 20, lg: 24 }
  if (typeof size === 'string') return maps[size]
  return size
}

export interface SwitchProps extends Omit<FowerHTMLProps<'input'>, 'size'> {
  colorScheme?: FowerColor

  offColorScheme?: FowerColor

  /**
   * Switch size, you can set any size
   */
  size?: Size

  /**
   * Aspect ratio for switch
   */
  aspectRatio?: number
}

export const Switch = memo(
  forwardRef<HTMLLabelElement, SwitchProps>(function Switch(
    props: SwitchProps,
    ref,
  ) {
    const {
      colorScheme = 'brand500',
      offColorScheme = 'gray400',
      size = 'md',
      aspectRatio = 1.8,
      ...rest
    } = props
    const formattedSize = formatSize(size)
    const width = formattedSize * aspectRatio
    const borderWidth = Math.ceil(formattedSize / 10)

    return (
      <Checkbox
        {...rest}
        ref={ref}
        render={({ checked }) => {
          const x = checked ? `${width - formattedSize}px` : '0px'
          const currentColor = checked ? colorScheme : offColorScheme
          return (
            <Box
              h={formattedSize}
              w={width}
              roundedFull
              border={borderWidth}
              borderColor={currentColor}
              bg={currentColor}
              bg--dark={currentColor}
              boxContent
            >
              <Box
                circle={formattedSize}
                bgWhite
                bgGray100--dark
                css={{
                  transform: `translateX(${x})`,
                  transition: 'transform ease 250ms',
                }}
              />
            </Box>
          )
        }}
      />
    )
  }),
)
