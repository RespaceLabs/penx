import React, { FC, forwardRef, PropsWithChildren } from 'react'
import { Box, FowerHTMLProps, styled } from '@fower/react'
import { Avatar } from './Avatar'
import { AvatarGroupProvider } from './context'

export interface AvatarGroupProps extends FowerHTMLProps<'div'> {
  max?: number
}

export const AvatarGroup = forwardRef<
  HTMLDivElement,
  PropsWithChildren<AvatarGroupProps>
>(function AvatarGroup(props, ref) {
  const { children } = props
  const len = React.Children.count(children)
  const { max = 10, ...rest } = props

  return (
    <AvatarGroupProvider value={{ max }}>
      <Box ref={ref} toCenterY {...rest}>
        {!Array.isArray(children)
          ? children
          : children.map((item, index) => {
              if (index >= max) return null
              return item
            })}
        {len > max && <Avatar name={`+${len - max}`} bgGray500 />}
      </Box>
    </AvatarGroupProvider>
  )
})
