import React, { FC, forwardRef, PropsWithChildren } from 'react'
import { Box, FowerHTMLProps } from '@fower/react'

export interface ModalHeaderProps extends FowerHTMLProps<'div'> {}

export const ModalHeader = forwardRef<
  HTMLDivElement,
  PropsWithChildren<ModalHeaderProps>
>(function ModalHeader(props, ref) {
  return <Box mb4 fontSemibold textXL ref={ref} {...props} />
})
