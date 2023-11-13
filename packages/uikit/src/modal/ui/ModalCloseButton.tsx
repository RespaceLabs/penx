import React, { FC, forwardRef, PropsWithChildren, useContext } from 'react'
import { FowerHTMLProps } from '@fower/react'
import { CloseButton } from '../../close-button'
import { modalContext } from '../modalContext'

interface Props extends FowerHTMLProps<'button'> {}

export const ModalCloseButton = forwardRef<
  HTMLDivElement,
  PropsWithChildren<Props>
>(function ModalCloseButton(props, ref) {
  const ctx = useContext(modalContext)
  const { close } = ctx

  return (
    <CloseButton
      ref={ref as any}
      onClick={close}
      absolute
      top2
      right2
      {...props}
    />
  )
})
