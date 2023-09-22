import React, { forwardRef } from 'react'
import { usePopoverContext } from '../popover'
import { Radio } from '../radio'
import { SelectItemProps, SelectSize } from './types'

const sizes: Record<SelectSize, number> = {
  sm: 32,
  md: 40,
  lg: 48,
}

export const SelectItem = forwardRef<HTMLInputElement, SelectItemProps>(
  function SelectItem(props, ref) {
    const { children, value, size = 'md' } = props

    const height: any = sizes[size] || size
    const ctx = usePopoverContext()

    return (
      <Radio
        ref={ref}
        toCenterY
        px2
        py3
        bgGray100--hover
        textSM
        value={value}
        css={(props) => {
          const checked = props['data-state'] === 'checked'
          const disabled = props['data-disabled']
          return {
            cursorNotAllowed: disabled,
            'opacity-50': disabled,
            bgGray100: checked,
          }
        }}
        onClick={(e) => {
          props?.onClick?.(e)
          ctx.close()
        }}
      >
        {children}
      </Radio>
    )
  },
)
