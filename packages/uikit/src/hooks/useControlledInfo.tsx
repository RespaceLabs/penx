import { useRef } from 'react'

export function useControlledInfo<T>(controlledValue: T, stateValue: T) {
  const { current: controlled } = useRef(controlledValue !== undefined)
  return {
    value: controlled ? controlledValue : stateValue,
    controlled,
  }
}
