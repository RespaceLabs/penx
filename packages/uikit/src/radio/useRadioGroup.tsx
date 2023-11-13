import { ChangeEvent, useCallback, useState } from 'react'
import { useControlledInfo, useId } from '../hooks'
import { RadioGroupProps, StringOrNumber, UseRadioGroupReturn } from './types'

export function useRadioGroup(props: RadioGroupProps): UseRadioGroupReturn {
  const { defaultValue, onChange: onChangeProp } = props
  const [state, setState] = useState<StringOrNumber>(defaultValue || '')
  const { controlled, value } = useControlledInfo(props.value, state)
  const name = useId(undefined, 'radio')

  const setValue = useCallback(
    (nextValue: StringOrNumber) => {
      if (!controlled) setState(nextValue)
      onChangeProp?.(nextValue)
    },
    [controlled, onChangeProp],
  )

  /** @example <RadioGroup onChange={...}></RadioGroup> */
  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      // TODO:
      e
      // const nextValue = getNextCheckboxGroupValue(e, groupValue)
      // setValue(nextValue)
    },
    [value, setValue],
  )

  return {
    name,
    controlled,
    value,
    onChange,
    setValue,
  }
}
