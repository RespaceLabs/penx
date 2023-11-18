import { ChangeEvent, useCallback, useState } from 'react'
import { useControlledInfo } from '../hooks'
import {
  CheckboxGroupProps,
  CheckboxGroupValue,
  UseCheckboxGroupReturn,
} from './types'
import { getNextCheckboxGroupValue } from './utils'

export function useCheckboxGroup(
  props: CheckboxGroupProps,
): UseCheckboxGroupReturn {
  const { defaultValue = [], onChange: onChangeProp } = props
  // checkGroup inner state
  const [state, setState] = useState<CheckboxGroupValue>(defaultValue)
  const { controlled, value: groupValue = [] } = useControlledInfo(
    props.value,
    state,
  )

  const setValue = useCallback(
    (nextValue: CheckboxGroupValue) => {
      if (!controlled) setState(nextValue)
      onChangeProp?.(nextValue)
    },
    [controlled, onChangeProp],
  )

  /** @example <CheckGroup onChange={...}></CheckGroup> */
  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const nextValue = getNextCheckboxGroupValue(e, groupValue)
      setValue(nextValue)
    },
    [groupValue, setValue],
  )

  return {
    controlled,
    value: groupValue,
    onChange,
    setValue,
  }
}
