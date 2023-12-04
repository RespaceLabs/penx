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
        <RadioGroup toCenterY w-100p gap6 value={value} onChange={onChange}>
          {options.map((option, index) => (
            <Radio key={option.value} value={option.value} flex-1>
              {({ checked }) => (
                <Box
                  px={[12, 12, 24]}
                  gapX={[8, 8, 20]}
                  transitionAll
                  border
                  borderGray200
                  rounded-12
                  brand500={checked}
                  borderBrand500={checked}
                  toCenterY
                  flex-1
                  text={[16, 16, 20]}
                  py5
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
