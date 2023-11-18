import React, { forwardRef } from 'react'
import { Box, FowerHTMLProps } from '@fower/react'

export const typeStyles = {
  default: { bgGray500: true },
  info: { bgBlue500: true },
  warning: { bgOrange500: true },
  success: { bgGreen500: true },
  error: { bgRed500: true },
}

export type DotType = keyof typeof typeStyles

export interface DotProps extends FowerHTMLProps<'div'> {
  type?: DotType
}

export const Dot = forwardRef<HTMLDivElement, DotProps>(
  function Dot(props, ref) {
    const { type = 'default', children, ...rest } = props

    return (
      <Box className="uikit-dot" ref={ref} inlineFlex toCenterY>
        <Box
          className="uikit-dot-color"
          square-8
          roundedFull
          {...typeStyles[type]}
          {...rest}
        ></Box>
        {children && (
          <Box as="span" className="uikit-dot-text" ml-8>
            {children}
          </Box>
        )}
      </Box>
    )
  },
)
