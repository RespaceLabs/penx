import { forwardRef, ReactNode } from 'react'
import { Box } from '@fower/react'
import { Radio, RadioGroup, RadioIndicator } from 'uikit'

type Option<T = any> = {
  label: ReactNode
  value: T
}

interface Props {
  options: Option[]
  value: any
  onChange(value: any): void
}

export const BorderedRadioGroup = forwardRef<HTMLDivElement, Props>(
  function BorderedRadioGroup({ value, options = [], onChange }, ref) {
    return (
      <Box ref={ref}>
        <RadioGroup toCenterY w-100p gap4 value={value} onChange={onChange}>
          {options.map((option, index) => (
            <Radio key={option.value} value={option.value} flex-1>
              {({ checked }) => (
                <Box
                  px2
                  gapX2
                  border-1
                  rounded-12
                  borderBrand500={checked}
                  toCenterY
                  flex-1
                  h-40
                  textSM
                >
                  <RadioIndicator />
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
