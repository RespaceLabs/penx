import { forwardRef, ReactNode } from 'react'
import { Box } from '@fower/react'
import { Radio, RadioGroup } from 'uikit'

type Option<T = any> = {
  label: ReactNode
  value: T
}

interface Props {
  options: Option[]
  value: any
  onChange(value: any): void
}

export const ExtensionFilter = forwardRef<HTMLDivElement, Props>(
  function ExtensionFilter({ value, options = [], onChange }, ref) {
    return (
      <Box ref={ref} borderBottom>
        <RadioGroup toCenterY w-100p gap4 value={value} onChange={onChange}>
          {options.map((option, index) => (
            <Radio key={option.value} value={option.value} flex-1>
              {({ checked }) => (
                <Box
                  px2
                  borderBottom-2
                  borderBrand500={checked}
                  borderTransparent={!checked}
                  toCenterY
                  flex-1
                  h-42
                  textSM
                >
                  {option.label}
                </Box>
              )}
            </Radio>
          ))}
        </RadioGroup>
      </Box>
    )
  },
)
