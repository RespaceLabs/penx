import React, { FC, PropsWithChildren } from 'react'
import { forwardRef } from '@bone-ui/utils'
import { Box, FowerHTMLProps } from '@fower/react'

export interface ModalTitleProps extends FowerHTMLProps<'div'> {}

export const ModalTitle: FC<PropsWithChildren<ModalTitleProps>> = forwardRef(
  (props, ref) => {
    return <Box fontSemibold leadingRelaxed text2XL ref={ref} {...props} />
  },
)
