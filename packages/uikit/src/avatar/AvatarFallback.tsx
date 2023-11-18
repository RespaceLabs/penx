import React, { FC, forwardRef } from 'react'
import { Box, FowerHTMLProps, fowerStore } from '@fower/react'
import { useId } from '../hooks'
import { useAvatarContext } from './context'

export interface AvatarFallbackProps extends FowerHTMLProps<'span'> {
  letterNum?: number
}

export const AvatarFallback = forwardRef<HTMLDivElement, AvatarFallbackProps>(
  function AvatarFallback(
    { letterNum = 1, children, ...rest }: AvatarFallbackProps,
    ref,
  ) {
    const ctx = useAvatarContext()
    const id = useId(undefined, '')
    const { colors } = fowerStore.theme

    const keys = Object.keys(colors)
      .filter((i) => i.endsWith('400'))
      .filter((i) =>
        /red|blue|purple|orange|rose|pink|fuchsia|violet|indigo|sky|teal|emerald|amber/.test(
          i,
        ),
      )
      .sort()
    const colorName = keys[Number(id || 0) % keys.length]

    if (ctx.imageLoadingStatus === 'loaded') return null

    return (
      <Box ref={ref} w-100p h-100p inlineFlex toCenter bg={colorName} {...rest}>
        {typeof children === 'string' ? children.slice(0, letterNum) : children}
      </Box>
    )
  },
)
