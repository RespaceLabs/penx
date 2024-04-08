import React, {
  cloneElement,
  forwardRef,
  isValidElement,
  MouseEvent,
  ReactNode,
} from 'react'
import { Box, FowerHTMLProps } from '@fower/react'
import { useModalContext } from '../modalContext'
import { ModalContext } from '../types'

export interface ModalCloseProps
  extends Omit<FowerHTMLProps<'div'>, 'children'> {
  asChild?: boolean
  children?: ((ctx: ModalContext) => ReactNode) | ReactNode
}

export const ModalClose = forwardRef<HTMLDivElement, ModalCloseProps>(
  function ModalTrigger(
    { children, asChild, onClick, ...rest }: ModalCloseProps,
    ref,
  ) {
    const ctx = useModalContext()

    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
      onClick?.(e)
      ctx.close()
    }

    if (typeof children === 'function') {
      return <>{children(ctx)}</>
    }

    if (asChild && isValidElement(children)) {
      return cloneElement(children, {
        ref,
        ...rest,
        onClick: handleClick,
      } as any)
    }

    return (
      <Box inlineFlex {...rest} onClick={handleClick}>
        {children}
      </Box>
    )
  },
)
