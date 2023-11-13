import React, { FC, forwardRef, useEffect, useState } from 'react'
import { Popover } from '../popover'
import { RadioGroupProvider } from '../radio'
import { SelectProvider } from './context'
import { SelectProps, SelectSize } from './types'

const sizes: Record<SelectSize, number> = {
  sm: 32,
  md: 40,
  lg: 48,
}

export const Select = forwardRef<HTMLDivElement, SelectProps>(
  function Select(props, ref) {
    const {
      children,
      onChange,
      value,
      size = 'md',
      placement = 'bottom',
      portal,
    } = props

    const [selectedValue, setSelectedValue] = useState<any>(value)
    const [selectedItem, setSelectedItem] = useState<any>('')

    useEffect(() => {
      if (selectedValue !== value) {
        setSelectedValue(value)
      }
    }, [value, setSelectedValue, selectedValue])

    function setValue(value: any) {
      setSelectedValue(value)
      onChange && onChange(value)
    }

    const ctxValue = {
      value: selectedValue,
      setValue,
    }

    const height: any = sizes[size] || size

    return (
      <SelectProvider
        value={{
          ...props,
          height,
          selectedItem,
          setSelectedItem,
        }}
      >
        <RadioGroupProvider value={ctxValue as any}>
          <Popover placement={placement} portal={portal}>
            {children}
          </Popover>
        </RadioGroupProvider>
      </SelectProvider>
    )
  },
)
