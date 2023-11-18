import React, { FC, forwardRef } from 'react'
import { Box, FowerHTMLProps, styled } from '@fower/react'
import {
  AvatarProvider,
  ImageLoadingStatus,
  useAvatarGroupContext,
} from './context'

export interface AvatarProps extends FowerHTMLProps<'img'> {
  name?: string | number
  src?: string
  size?: 'sm' | 'md' | 'lg' | number
}

const sizes: any = {
  sm: 24,
  md: 32,
  lg: 48,
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  function Avatar(props, ref) {
    const { src, size = 'md', name, ...rest } = props
    const s = sizes[size] || size
    const ctx = useAvatarGroupContext()
    const isGrouped = Object.keys(ctx).length > 0

    const [imageLoadingStatus, setImageLoadingStatus] =
      React.useState<ImageLoadingStatus>('idle')

    return (
      <AvatarProvider
        value={{
          imageLoadingStatus: imageLoadingStatus,
          onImageLoadingStatusChange: setImageLoadingStatus,
        }}
      >
        <Box
          ref={ref}
          className="uikit-avatar"
          data-grouped={isGrouped}
          toCenter
          square={s}
          rounded={s}
          white
          bgGray300
          overflowHidden
          cursorPointer
          text={s * 0.5}
          border-2={isGrouped}
          borderWhite={isGrouped}
          boxContent={isGrouped}
          m--4={isGrouped}
          {...rest}
        />
      </AvatarProvider>
    )
  },
)
