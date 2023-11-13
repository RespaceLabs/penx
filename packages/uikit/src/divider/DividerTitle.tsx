import React, { FC, forwardRef, useContext } from 'react'
import { Box, FowerHTMLProps } from '@fower/react'
import { dividerContext } from './context'

export interface DividerTitleProps extends FowerHTMLProps<'div'> {}

export const DividerTitle = forwardRef<HTMLDivElement, DividerTitleProps>(
  function DividerTitle(props, ref) {
    const { orientation } = useContext(dividerContext)
    const isVertical = orientation === 'vertical'
    return (
      <Box
        ref={ref}
        absolute
        bgWhite
        left-50p
        top-50p
        py2={isVertical}
        px3={!isVertical}
        inlineFlex
        toCenter
        css={{
          transform: 'translate(-50%, -50%)',
        }}
        {...props}
      />
    )
  },
)
