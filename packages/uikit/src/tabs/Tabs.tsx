import React, { FC, useEffect, useState } from 'react'
import { RadioGroup, RadioGroupProps, useRadioGroup } from '@bone-ui/radio'
import { forwardRef } from '@bone-ui/utils'
import { Box } from '@fower/react'

export interface TabsProps extends RadioGroupProps {
  hideDivider?: boolean
  align?: 'center' | 'left' | 'right'
  isLazy?: boolean
}

function getNodes({ children }: TabsProps): any[] {
  if (!children) return []
  return Array.isArray(children) ? children : [children]
}

export const Tabs: FC<TabsProps> = forwardRef((props: TabsProps, ref) => {
  const {
    onChange,
    hideDivider,
    isLazy = false,
    align = 'left',
    ...rest
  } = props
  const { value, controlled } = useRadioGroup(props)
  let [currentValue, setCurrentValue] = useState<any>(value)
  const nodes = getNodes(props)

  // TODO: too many render
  useEffect(() => {
    if (controlled && value !== currentValue) {
      setCurrentValue(value)
    }
  }, [value])

  return (
    <RadioGroup
      ref={ref}
      column
      {...rest}
      onChange={(selectedValue) => {
        if (!controlled) {
          setCurrentValue(selectedValue)
        }
        onChange && onChange(selectedValue)
      }}
    >
      <Box
        className="bone-tab-header"
        spaceX-12
        w-100p
        toLeft={align === 'left'}
        toCenter={align === 'center'}
        toRight={align === 'right'}
        borderBottom-1
        borderGray700--dark
        borderColor={hideDivider ? 'transparent' : '#f0f0f0'}
        mb-16
      >
        {props.children}
      </Box>

      {nodes.map((node = {}) => {
        const { props } = node
        const content = (
          <Box
            key={props?.value}
            className="bone-tab-content"
            w-100p
            display={props?.value === currentValue ? 'block' : 'none'}
          >
            {props?.children || null}
          </Box>
        )

        if (!isLazy) return content

        if (props?.value === currentValue) {
          return content
        } else {
          return null
        }
      })}
    </RadioGroup>
  )
})
