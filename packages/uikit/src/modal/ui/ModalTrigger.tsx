import React, { cloneElement, forwardRef, isValidElement } from 'react'
import { Box, FowerHTMLProps } from '@fower/react'
import { useModalContext } from '../modalContext'

export interface ModalTriggerProps extends FowerHTMLProps<'div'> {
  asChild?: boolean
}

export const ModalTrigger = forwardRef<HTMLDivElement, ModalTriggerProps>(
  function ModalTrigger(
    { children, asChild, onClick, ...rest }: ModalTriggerProps,
    ref,
  ) {
    const { open } = useModalContext()

    if (asChild && isValidElement(children)) {
      return cloneElement(children, {
        ref,
        ...rest,
        onClick: (e: any) => {
          onClick?.(e)
          open()
        },
      } as any)
    }

    return (
      <Box
        inlineFlex
        {...rest}
        onClick={(e) => {
          onClick?.(e)
          open()
        }}
      >
        {children}
      </Box>
    )
  },
)
