import React from 'react'
import { Box } from '@fower/react'
import { CheckOutline } from './CheckOutline'
import { CheckboxStatus } from './types'

export const checkboxDefaultRender = ({
  checked,
  colorScheme,
}: CheckboxStatus & { colorScheme: string }) => {
  const atomicProps: any = {}
  if (!!checked) {
    atomicProps.borderColor = colorScheme
    atomicProps.bg = colorScheme
  }
  return (
    <Box toCenter square-16 border-2 borderGray600={!checked} {...atomicProps}>
      <CheckOutline
        white
        square-20
        strokeWidth={4}
        hidden={!checked}
      ></CheckOutline>
    </Box>
  )
}
