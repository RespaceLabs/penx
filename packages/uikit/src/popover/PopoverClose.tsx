import React, { cloneElement, FC, forwardRef, isValidElement } from 'react'
import { Box, FowerHTMLProps } from '@fower/react'
import { usePopoverContext } from './context'

export interface PopoverCloseProps extends FowerHTMLProps<'div'> {
  asChild?: boolean
}

export const PopoverClose = forwardRef<HTMLDivElement, PopoverCloseProps>(
  function PopoverCloseProps(props, ref) {
    const { asChild, children, ...rest } = props

    const ctx = usePopoverContext()

    if (asChild && isValidElement(children)) {
      rest.onClick = (e) => {
        props.onClick?.(e)
        children.props.onClick?.(e)
        ctx?.close?.()
      }
      return cloneElement(children, rest || {})
    }

    return (
      <Box
        ref={ref}
        className="uikit-popover-close"
        {...rest}
        onClick={() => ctx?.close?.()}
      >
        {children}
      </Box>
    )
  },
)
