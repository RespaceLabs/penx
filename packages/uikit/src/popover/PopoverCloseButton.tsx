import React, { FC } from 'react'
import { CloseButton, CloseButtonProps } from '@bone-ui/close-button'
import { forwardRef } from '@bone-ui/utils'
import { usePopoverContext } from './context'

export interface PopoverCloseButtonProps extends CloseButtonProps {}

export const PopoverCloseButton: FC<PopoverCloseButtonProps> = forwardRef(
  (props: PopoverCloseButtonProps, ref) => {
    const ctx = usePopoverContext()
    return (
      <CloseButton
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
  },
)
