import React, { memo } from 'react'
import { Box } from '@fower/react'

export interface PopoverMaskProps {
  showMask?: boolean
  isOpen: boolean
  close: any
}
export const PopoverMask = memo(
  ({ showMask, isOpen, close }: PopoverMaskProps) => {
    if (showMask && isOpen) {
      return (
        <Box
          onClick={(e) => {
            e.stopPropagation()
            if (isOpen) close()
          }}
          className="uikit-popover-mask"
          display={isOpen ? 'block' : 'none'}
          bgTransparent
          fixed
          w-100p
          h-100p
          top0
          left0
          zIndex-10000
        />
      )
    }
    return null
  },
  (prev, next) =>
    prev.isOpen === next.isOpen && next.showMask === next.showMask,
)
