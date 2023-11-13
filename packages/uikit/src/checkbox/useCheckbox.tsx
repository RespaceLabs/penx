import { useState } from 'react'
import { useControlledInfo, useSafeLayoutEffect } from '../hooks'
import { useCheckboxGroupContext } from './checkboxGroupContext'
import { CheckboxProps, UseCheckboxReturn } from './types'
import { getNextCheckboxGroupValue } from './utils'

type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>

export function useCheckbox(props: CheckboxProps): UseCheckboxReturn {
  let inputProps: InputProps = {}
  const [disabled, setDisabled] = useState(props.disabled ?? false)
  const context = useCheckboxGroupContext()

  /**
   * If <CheckboxGroup/> is controlled, set <Checkbox/> to be controlled too
   */
  if (context?.controlled) {
    props.checked = context.value?.includes(props.value as any)
  }

  const [checkedState, setCheckedState] = useState(() => {
    if (!context) return props.defaultChecked

    const { value: groupValue = [] } = context
    return groupValue?.includes(props.value as any)
  })

  const { controlled, value: checked } = useControlledInfo(
    props.checked,
    checkedState,
  )

  useSafeLayoutEffect(() => {
    if (typeof props.disabled !== 'boolean') return
    setDisabled(!!props.disabled)
  }, [props.disabled])

  inputProps.onChange = (e: any) => {
    /** no context */
    if (!context) {
      if (!controlled) setCheckedState(e.target.checked)
      props?.onChange?.(e)
      return
    }

    /** has context */
    const { value: groupValue = [] } = context
    const { checked: targetChecked, value: targetValue } = e.target
    if (controlled) {
      setCheckedState(targetChecked)
    } else {
      const nextValue = getNextCheckboxGroupValue(e, groupValue)
      setCheckedState(nextValue.includes(targetValue))
    }

    props.onChange?.(e)
  }

  inputProps.disabled = disabled
  if (controlled) inputProps.checked = checked

  return {
    inputProps,
    state: { disabled, checked },
  }
}
