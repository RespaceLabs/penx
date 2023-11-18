import React, { FC, forwardRef } from 'react'
import { AtomicProps } from '@fower/atomic-props'
import { Box, FowerHTMLProps } from '@fower/react'
import { Placement, useInputGroupContext } from './context'

export interface InputAddonProps extends FowerHTMLProps<'div'> {
  placementMap?: 'left' | 'right'
}

export const InputAddon = forwardRef<HTMLDivElement, InputAddonProps>(
  function InputAddon(props, ref) {
    let attrs: AtomicProps = {}
    const ctx = useInputGroupContext()

    if (ctx.placementMap) {
      const { size, placementMap } = ctx
      const { placement } = placementMap.get(props)!

      attrs.h = size
      attrs.borderTop = 1
      attrs.borderBottom = 1

      if (placement === Placement.start) {
        attrs.borderLeft = 1
        attrs.roundedLeftMD = true
      }

      if (placement === Placement.end) {
        attrs.borderRight = 1
        attrs.roundedRightMD = true
      }
    }
    return (
      <Box
        className="uikit-input-addon"
        ref={ref}
        px4
        bgGray100
        toCenter
        borderGray300
        {...(attrs as any)}
        {...props}
      />
    )
  },
)
;(InputAddon as any).id = 'InputAddon'
