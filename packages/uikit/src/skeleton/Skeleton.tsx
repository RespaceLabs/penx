import React, { FC } from 'react'
import { forwardRef } from '@bone-ui/utils'
import { Box, FowerHTMLProps } from '@fower/react'

export interface SkeletonProps extends FowerHTMLProps<'div'> {}

export const Skeleton: FC<SkeletonProps> = forwardRef(
  (props: SkeletonProps, ref) => {
    return (
      <Box
        className={`bone-skeleton`}
        ref={ref}
        bgGray200
        animatePulse
        rounded
        w-100p
        minH-16
        {...props}
      ></Box>
    )
  },
)
