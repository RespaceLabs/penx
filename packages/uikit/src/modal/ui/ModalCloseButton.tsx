import React, { FC, PropsWithChildren, useContext } from 'react'
import { forwardRef } from '@bone-ui/utils'
import { FowerHTMLProps } from '@fower/react'
import { CloseButton } from '../../close-button'
import { modalContext } from '../modalContext'

interface Props extends FowerHTMLProps<'button'> {}

export const ModalCloseButton: FC<PropsWithChildren<Props>> = forwardRef(
  (props, ref) => {
    const ctx = useContext(modalContext)
    const { close } = ctx

    return (
      <CloseButton ref={ref} onClick={close} absolute top2 right2 {...props} />
    )
  },
)
