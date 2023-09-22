import React, { FC, PropsWithChildren } from 'react'
import { forwardRef } from '@bone-ui/utils'
import { Box, FowerHTMLProps } from '@fower/react'

export interface ModalHeaderProps extends FowerHTMLProps<'div'> {}

export const ModalHeader: FC<PropsWithChildren<ModalHeaderProps>> = forwardRef(
  (props, ref) => {
    return <Box py2 fontSemibold textXL ref={ref} {...props} />
  },
)
