import React, { FC, forwardRef } from 'react'
import { Box, FowerHTMLProps } from '@fower/react'
import { InputGroupProvider, Placement } from './context'

export interface InputGroupProps extends FowerHTMLProps<'div'> {}

function formatSize(size: any): number {
  const maps: any = { sm: 32, md: 40, lg: 48 }
  if (typeof size === 'string') return maps[size]
  return size
}

export const InputGroup = forwardRef<HTMLDivElement, InputGroupProps>(
  function InputGroup(props: InputGroupProps, ref) {
    let size: string = 'md'
    const { children } = props
    const childrenArray: any[] = Array.isArray(children) ? children : [children]

    const placementMap = new Map()

    const validChildren = childrenArray.filter((child) =>
      React.isValidElement(child),
    )

    validChildren.forEach((child, index) => {
      const { id = '' } = child.type
      const placement =
        index === 0
          ? Placement.start
          : index === validChildren.length - 1
          ? Placement.end
          : Placement.middle

      placementMap.set(child.props, { id, placement })
      if (child.props?.size) size = child.props?.size
    })

    return (
      <InputGroupProvider
        value={{
          size: formatSize(size),
          placementMap,
        }}
      >
        <Box
          className="uikit-input-group"
          ref={ref}
          toCenterY
          relative
          {...props}
        />
      </InputGroupProvider>
    )
  },
)
