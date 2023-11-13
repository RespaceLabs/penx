import React, { forwardRef, PropsWithChildren } from 'react'
import { Box, FowerHTMLProps } from '@fower/react'

export interface ModalBodyProps extends FowerHTMLProps<'div'> {}

export const ModalBody = forwardRef<
  HTMLDivElement,
  PropsWithChildren<ModalBodyProps>
>(function ModalBody(props, ref) {
  return <Box px6 py2 ref={ref} {...props} />
})
