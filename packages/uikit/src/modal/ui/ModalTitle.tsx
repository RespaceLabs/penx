import React, { FC, forwardRef, PropsWithChildren } from 'react'
import { Box, FowerHTMLProps } from '@fower/react'

export interface ModalTitleProps extends FowerHTMLProps<'div'> {}

export const ModalTitle = forwardRef<
  HTMLDivElement,
  PropsWithChildren<ModalTitleProps>
>(function ModalTitle(props, ref) {
  return <Box fontSemibold leadingRelaxed text2XL ref={ref} {...props} />
})
