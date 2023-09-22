import React, { cloneElement, forwardRef, isValidElement } from 'react'
import { Box, FowerHTMLProps } from '@fower/react'
import { useModalContext } from '../modalContext'

export interface ModalCloseProps extends FowerHTMLProps<'div'> {
  asChild?: boolean
}

export const ModalClose = forwardRef<HTMLDivElement, ModalCloseProps>(
  function ModalTrigger(
    { children, asChild, onClick, ...rest }: ModalCloseProps,
    ref,
  ) {
    const { close } = useModalContext()

    if (asChild && isValidElement(children)) {
      return cloneElement(children, {
        ref,
        ...rest,
        onClick: (e: any) => {
          onClick?.(e)
          close()
        },
      } as any)
    }

    return (
      <Box
        inlineFlex
        {...rest}
        onClick={(e) => {
          onClick?.(e)
          close()
        }}
      >
        {children}
      </Box>
    )
  },
)
