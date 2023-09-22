import React, { cloneElement, FC, isValidElement } from 'react'
import { forwardRef } from '@bone-ui/utils'
import { Box, FowerHTMLProps } from '@fower/react'
import { usePopoverContext } from './context'

export interface PopoverCloseProps extends FowerHTMLProps<'div'> {
  asChild?: boolean
}

export const PopoverClose: FC<PopoverCloseProps> = forwardRef(
  (props: PopoverCloseProps, ref) => {
    const { asChild, children, ...rest } = props
    const { close } = usePopoverContext()

    if (asChild && isValidElement(children)) {
      rest.onClick = (e) => {
        props.onClick?.(e)
        children.props.onClick?.(e)
        close()
      }
      return cloneElement(children, rest || {})
    }

    return (
      <Box
        ref={ref}
        className="bone-popover-close"
        {...rest}
        onClick={() => close()}
      >
        {children}
      </Box>
    )
  },
)
