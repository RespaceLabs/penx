import React, { FC, useMemo } from 'react'
import { forwardRef } from '@bone-ui/utils'
import { Box } from '@fower/react'
import { CheckboxGroupProvider } from './checkboxGroupContext'
import { CheckboxGroupContext, CheckboxGroupProps } from './types'
import { useCheckboxGroup } from './useCheckboxGroup'

export const CheckboxGroup: FC<CheckboxGroupProps> = forwardRef(
  (props, ref) => {
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
        <Box ref={ref} toLeft spaceX-8 {...(rest as any)}>
          {children}
        </Box>
      </CheckboxGroupProvider>
    )
  },
)
