import React, { FC, forwardRef } from 'react'
import { Box, css } from '@fower/react'
import { RadioProvider } from './radioContext'
import { RadioProps } from './types'
import { useRadio } from './useRadio'

const cx = (...classNames: any[]) => classNames.filter(Boolean).join(' ')

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  props: RadioProps,
  ref,
) {
  const { children, ...rest } = props
  const { inputProps, state } = useRadio(props)
  const { disabled, checked } = state

  return (
    <RadioProvider value={{ disabled, checked }}>
      <Box
        as="label"
        data-state={checked ? 'checked' : 'unchecked'}
        data-disabled={disabled}
        className="uikit-radio"
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
            'uikit-radio-input',
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
