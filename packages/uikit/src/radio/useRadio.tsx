import { useEffect, useState } from 'react'
import { useRadioGroupContext } from './radioGroupContext'
import { HtmlInputProps, RadioHooksResult, RadioProps } from './types'

export function useRadio(props: RadioProps): RadioHooksResult {
  let inputProps = {} as HtmlInputProps
  const { value, onChange } = props

  /** hooks */
  const context = useRadioGroupContext()
  const [disabled, setDisabled] = useState(props.disabled ?? false)
  const [checked, setChecked] = useState(
    props.checked || props.defaultChecked || false,
  )

  useEffect(() => {
    if (typeof props.checked !== 'boolean') return
    setChecked(!!props.checked)
  }, [props.checked])

  useEffect(() => {
    if (typeof props.disabled !== 'boolean') return
    setDisabled(!!props.disabled)
  }, [props.disabled])

  /** For radio group */
  if (context) {
    const { value: radioGroupValue, setValue: setRadioGroupValue } = context
    inputProps.checked = value === radioGroupValue
    inputProps.onChange = (e) => {
      setRadioGroupValue?.(value)
      onChange && onChange(e)
    }
  } else {
    inputProps.onChange = (e) => {
      const { checked } = e.target
      setChecked(checked)
    }
  }

  return {
    inputProps,
    state: {
      disabled,
      checked: context ? !!inputProps.checked : checked,
    },
  }
}
