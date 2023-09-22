import React, { FC, useMemo } from 'react'
import { forwardRef } from '@bone-ui/utils'
import { Box } from '@fower/react'
import { Radio } from './Radio'
import { RadioGroupProvider } from './radioGroupContext'
import { RadioGroupContext, RadioGroupProps, RadioProps } from './types'
import { useRadioGroup } from './useRadioGroup'

function checkIsControlled(props: RadioGroupProps) {
  if (Reflect.has(props, 'value') && !Reflect.has(props, 'onChange')) {
    console.error(
      'when using radio group with controlled mode, value and onChange Props is required',
    )
  }
}

export const RadioGroup: FC<RadioGroupProps> = forwardRef(
  (props: RadioGroupProps, ref) => {
    const {
      defaultValue,
      value: propValue,
      onChange: onChangeProp,
      children,
      ...rest
    } = props

    const { value, onChange, setValue, controlled, name } = useRadioGroup(props)

    const ctxValue: RadioGroupContext = useMemo(
      () => ({
        controlled,
        onChange,
        value,
        setValue,
        name,
      }),
      [controlled, value, onChange, setValue, name],
    )

    checkIsControlled(props)

    return (
      <RadioGroupProvider value={ctxValue}>
        <Box ref={ref} toLeft gap2 {...rest}>
          {children}
        </Box>
      </RadioGroupProvider>
    )
  },
)
