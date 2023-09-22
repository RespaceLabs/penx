import { ChangeEvent } from 'react'
import { CheckboxGroupValue } from './types'

export function getNextCheckboxGroupValue(
  e: ChangeEvent<HTMLInputElement>,
  currentGroupValue: CheckboxGroupValue,
) {
  const { checked, value: targeValue } = e.target as any

  return checked
    ? [...currentGroupValue, targeValue]
    : currentGroupValue.filter((i) => i !== targeValue)
}
