import React, { FC, useLayoutEffect } from 'react'
import { forwardRef } from '@bone-ui/utils'
import { FowerHTMLProps, styled } from '@fower/react'
import { useAvatarContext } from './context'
import { useImageLoadingStatus } from './useImageLoadingStatus'

const Image = styled('img')

export interface AvatarImageProps extends FowerHTMLProps<'img'> {}

export const AvatarImage: FC<AvatarImageProps> = forwardRef(
  (props: AvatarImageProps, ref) => {
    const context = useAvatarContext()
    const imageLoadingStatus = useImageLoadingStatus(props.src)

    useLayoutEffect(() => {
      if (imageLoadingStatus !== 'idle') {
        context.onImageLoadingStatusChange(imageLoadingStatus)
      }
    }, [imageLoadingStatus, context])

    if (imageLoadingStatus !== 'loaded') return null

    return (
      <Image
        ref={ref}
        className="bone-avatar-img"
        square-100p
        alt=""
        {...props}
      />
    )
  },
)
