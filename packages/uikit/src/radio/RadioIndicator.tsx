import React, { forwardRef } from 'react'
import { Box, FowerColor, FowerHTMLProps } from '@fower/react'
import { useRadioContext } from './radioContext'

interface RadioIndicatorProps extends FowerHTMLProps<'div'> {
  colorScheme?: FowerColor
}

export const RadioIndicator = forwardRef<HTMLDivElement, RadioIndicatorProps>(
  function RadioIndicator(props, ref) {
    const { colorScheme = 'brand500', ...rest } = props
    const { checked } = useRadioContext()

    return (
      <Box
        ref={ref}
        toCenter
        circle-16
        bg={colorScheme}
        border-1
        overflowHidden
        {...rest}
      >
        <Box circle-10 circle-6={checked} bg={colorScheme} bgWhite></Box>
      </Box>
    )
  },
)
