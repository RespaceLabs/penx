import React, { ChangeEvent, FC } from 'react'
import { cx, forwardRef } from '@bone-ui/utils'
import { Box, css } from '@fower/react'
import { checkboxDefaultRender } from './checkboxDefaultRender'
import { useCheckboxGroupContext } from './checkboxGroupContext'
import { CheckboxProps } from './types'
import { useCheckbox } from './useCheckbox'

export const Checkbox: FC<CheckboxProps> = forwardRef(
  (props: CheckboxProps, ref) => {
    const {
      children,
      colorScheme = 'brand500',
      render = checkboxDefaultRender,
      value,
      defaultChecked,
      disabled: propDisabled,
      onChange: propOnChange,
      ...rest
    } = props
    const context = useCheckboxGroupContext()

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
      context?.onChange(e)
      return props?.onChange?.(e)
    }

    const { inputProps, state } = useCheckbox({ ...props, onChange })
    const { disabled } = state

    // TODO: need refactor
    let checkedProps: any = {}
    if (Reflect.has(props, 'defaultChecked')) {
      checkedProps.defaultChecked = defaultChecked
    } else {
      checkedProps.checked = state.checked
    }

    return (
      <Box
        as="label"
        className="bone-checkbox"
        inlineFlex
        toCenterY
        toLeft
        gap2
        cursorPointer={!disabled}
        cursorNotAllowed={disabled}
        opacity-50={disabled}
        {...(rest as any)}
      >
        <input
          ref={ref}
          className={cx(
            'bone-checkbox-input',
            css('square0', 'opacity-0', 'hidden'),
          )}
          type="checkbox"
          value={value}
          {...checkedProps}
          {...inputProps}
        />

        {render({ ...state, children, colorScheme })}

        {children && (
          <Box className="bone-checkbox-label" leading-1em>
            {children}
          </Box>
        )}
      </Box>
    )
  },
)
