import React, { FC, forwardRef } from 'react'
import { Box, FowerHTMLProps } from '@fower/react'

export interface SkeletonCircleProps extends FowerHTMLProps<'div'> {
  size?: number
}

export const SkeletonCircle = forwardRef<HTMLDivElement, SkeletonCircleProps>(
  function SkeletonCircle(props, ref) {
    return (
      <Box
        className={`uikit-skeleton-circle`}
        ref={ref}
        bgGray200
        animatePulse
        roundedFull
        square={props.size || 24}
        {...props}
      ></Box>
    )
  },
)
