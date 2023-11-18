import React, { FC, forwardRef } from 'react'
import { Box, FowerHTMLProps } from '@fower/react'
import { DividerProvider } from './context'

export interface DividerProps extends FowerHTMLProps<'div'> {
  orientation?: 'vertical' | 'horizontal'
}

export const Divider = forwardRef<HTMLDivElement, DividerProps>(
  function Divider(props, ref) {
    const { orientation = 'horizontal', ...rest } = props
    const isVertical = orientation === 'vertical'
    return (
      <DividerProvider value={{ orientation }}>
        <Box
          ref={ref}
          className="uikit-divider"
          relative
          bgGray200
          w-1={isVertical}
          h-100p={isVertical}
          h-1={!isVertical}
          w-100p={!isVertical}
          {...rest}
        />
      </DividerProvider>
    )
  },
)
