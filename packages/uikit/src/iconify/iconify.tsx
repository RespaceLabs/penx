import React, { FC, forwardRef } from 'react'
import { AtomicProps } from '@fower/atomic-props'
import { Box, FowerHTMLProps } from '@fower/react'

export interface IconProps extends FowerHTMLProps<'svg'> {
  fill?: 'none' | 'currentColor' | (string & {})

  strokeWidth?: number | string

  size?: number
}

export interface IconifyOptions {
  /**
   * The icon `svg` viewBox
   * @default "0 0 24 24"
   */
  viewBox?: string

  /**
   * The `svg` path or group element
   * @type React.ReactElement | React.ReactElement[]
   */
  path?: React.ReactElement | React.ReactElement[]

  /**
   * If the has a single path, simply copy the path's `d` attribute
   */
  d?: string

  fill?: 'none' | 'currentColor'

  displayName?: string

  atomicProps?: AtomicProps

  pathProps?: {
    strokeLinecap?: 'butt' | 'round' | 'square' | 'inherit'
    strokeLinejoin?: 'miter' | 'round' | 'bevel' | 'inherit'
    strokeWidth?: number | string
    fillRule?: 'nonzero' | 'evenodd' | 'inherit'
    fill?: string
    clipRule?: number | string
  }
}

export function iconify(options: IconifyOptions) {
  const {
    viewBox,
    d,
    fill = '#777E91',
    path,
    displayName,
    pathProps = {},
    atomicProps = {},
  } = options

  const Comp = forwardRef<HTMLOrSVGElement, IconProps>((props, ref) => {
    const size = 24

    return (
      <Box
        as="svg"
        ref={ref}
        fill={fill}
        xmlns="http://www.w3.org/2000/svg"
        square={props.size || atomicProps?.square || 24}
        viewBox={viewBox || `0 0 ${size} ${size}`}
        {...atomicProps}
        {...(props as any)}
      >
        {path ?? (
          <path fillRule="evenodd" clipRule="evenodd" {...pathProps} d={d} />
        )}
      </Box>
    )
  })

  if (displayName) Comp.displayName = displayName

  return Comp
}
