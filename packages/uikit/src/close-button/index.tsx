import React, { forwardRef } from 'react'
import { Box, FowerHTMLProps } from '@fower/react'
import { X } from 'lucide-react'

type Size = 'sm' | 'md' | 'lg' | number

export interface CloseButtonProps extends FowerHTMLProps<'button'> {
  size?: Size
}

export const CloseButton = forwardRef<HTMLDivElement, CloseButtonProps>(
  function CloseButton(props, ref) {
    const { size = 32, children, ...rest } = props
    const sizeStyle = getSizeStyle(size)
    return (
      <Box
        as="button"
        ref={ref}
        aria-label="Close"
        className="uikit-close-button"
        toCenter
        cursorPointer
        p0
        bgTransparent
        gray600
        bgBlack--T94--hover
        outlineNone
        borderNone
        css={{ transition: 'background-color 0.3s' }}
        {...sizeStyle}
        {...(rest as any)}
      >
        <X size={sizeStyle.square * 0.7} />
      </Box>
    )
  },
)

function getSizeStyle(size: Size) {
  let square: number
  const squareMaps: Record<Size, number> = { sm: 24, md: 32, lg: 40 }
  if (typeof size === 'string') {
    square = squareMaps[size] || squareMaps['md']
  } else {
    square = size
  }

  return {
    square,
    rounded: square * 0.2,
  }
}
