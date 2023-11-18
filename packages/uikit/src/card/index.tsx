import React, { FC, forwardRef } from 'react'
import { Box, FowerHTMLProps } from '@fower/react'

export interface CardProps extends FowerHTMLProps<'div'> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  function Card(props, ref) {
    return (
      <Box
        className="uikit-card"
        ref={ref}
        p6
        bgWhite
        rounded
        minW-256
        overflowHidden
        border
        borderGray200
        css={{ transition: 'box-shadow 0.3s ease' }}
        {...props}
      />
    )
  },
)
