import React, { FC, forwardRef, useMemo } from 'react'
import { Box } from '@fower/react'
import { CheckboxGroupProvider } from './checkboxGroupContext'
import { CheckboxGroupContext, CheckboxGroupProps } from './types'
import { useCheckboxGroup } from './useCheckboxGroup'

export const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>(
  function CheckboxGroup(props, ref) {
    const {
      defaultValue,
      value: propValue,
      onChange: onChangeProp,
      options,
      name,
      children,
      ...rest
    } = props
    const { value, onChange, setValue, controlled } = useCheckboxGroup(props)

    const contextValue: CheckboxGroupContext = useMemo(
      () => ({ controlled, onChange, value, setValue }),
      [controlled, value, onChange, setValue],
    )

    return (
      <CheckboxGroupProvider value={contextValue}>
        <Box ref={ref} toLeft gap2 {...(rest as any)}>
          {children}
        </Box>
      </CheckboxGroupProvider>
    )
  },
)
