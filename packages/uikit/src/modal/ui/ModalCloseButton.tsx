import React, { FC, forwardRef, PropsWithChildren, useContext } from 'react'
import { FowerHTMLProps } from '@fower/react'
import { CloseButton } from '../../close-button'
import { modalContext } from '../modalContext'

interface Props extends FowerHTMLProps<'button'> {}

export const ModalCloseButton: FC = forwardRef<HTMLButtonElement, Props>(
  function ModalCloseButton(props, ref) {
    const ctx = useContext(modalContext)
    const { close } = ctx

    return (
      <CloseButton
        ref={ref}
        onClick={close}
        absolute
        top={[16, 32]}
        right={[16, 32]}
        {...props}
      />
    )
  },
)
