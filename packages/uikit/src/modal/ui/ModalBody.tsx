import React, { FC, PropsWithChildren } from 'react'
import { forwardRef } from '@bone-ui/utils'
import { Box, FowerHTMLProps } from '@fower/react'

export interface ModalBodyProps extends FowerHTMLProps<'div'> {}

export const ModalBody: FC<PropsWithChildren<ModalBodyProps>> = forwardRef(
  (props, ref) => {
    return <Box px6 py2 ref={ref} {...props} />
  },
)
