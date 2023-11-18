import React, { forwardRef } from 'react'
import { CloseButton, CloseButtonProps } from '../close-button'
import { usePopoverContext } from './context'

export interface PopoverCloseButtonProps extends CloseButtonProps {}

export const PopoverCloseButton = forwardRef<
  HTMLButtonElement,
  PopoverCloseButtonProps
>(function PopoverCloseButton(props, ref) {
  const ctx = usePopoverContext()
  return (
    <CloseButton
      ref={ref as any}
      onClick={(e) => {
        ctx.close()
        props?.onClick?.(e)
      }}
      size="sm"
      absolute
      top-8
      right-8
      {...props}
    ></CloseButton>
  )
})
