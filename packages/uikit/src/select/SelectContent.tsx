import React, { forwardRef, useEffect } from 'react'
import { PopoverContent, PopoverContentProps } from '../popover'
import { useRadioGroupContext } from '../radio'
import { useSelectContext } from './context'

export interface SelectContentProps extends PopoverContentProps {}

export const SelectContent = forwardRef<HTMLDivElement, SelectContentProps>(
  function SelectContent(props, ref) {
    const { children, useTriggerWidth = true, ...rest } = props
    const { setSelectedItem } = useSelectContext()
    const ctx = useRadioGroupContext()

    useEffect(() => {
      // TODO: handle any
      const arr = React.Children.toArray(children as any)

      const find = arr.find((item) => {
        if (typeof item === 'object') {
          return (item as any)?.props?.value === ctx.value
        }
        return false
      })
      if (find) setSelectedItem?.(find)
    }, [ctx.value, children, setSelectedItem])

    return (
      <PopoverContent
        ref={ref as any}
        useTriggerWidth={useTriggerWidth}
        overflowYAuto
        {...rest}
      >
        {children}
      </PopoverContent>
    )
  },
)
