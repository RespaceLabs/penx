import React, { FC } from 'react'
import { cx, forwardRef } from '@bone-ui/utils'
import { Box, css } from '@fower/react'
import { RadioProvider } from './radioContext'
import { RadioProps } from './types'
import { useRadio } from './useRadio'

export const Radio: FC<RadioProps> = forwardRef((props: RadioProps, ref) => {
  const { children, ...rest } = props
  const { inputProps, state } = useRadio(props)
  const { disabled, checked } = state

  return (
    <RadioProvider value={{ disabled, checked }}>
      <Box
        as="label"
        data-state={checked ? 'checked' : 'unchecked'}
        data-disabled={disabled}
        className="bone-radio"
        toCenterY
        toLeft
        gapX2
        cursorPointer={!disabled}
        cursorNotAllowed={disabled}
        opacity-50={disabled}
        {...rest}
      >
        <input
          className={cx(
            'bone-radio-input',
            css('square0', 'opacity-0', 'hidden'),
          )}
          ref={ref}
          type="radio"
          {...inputProps}
        />

        {typeof children === 'function' ? children(state) : children}
      </Box>
    </RadioProvider>
  )
})
