import React, { FC, PropsWithChildren } from 'react'
import { Button } from 'uikit'
import { useNode } from '@penx/hooks'
import { IconStar, IconStarSolid } from '@penx/icons'

interface Props {}

export const FavoriteButton: FC<PropsWithChildren<Props>> = () => {
  const { nodeService } = useNode()
  const isFavorite = nodeService.isFavorite()
  return (
    <Button
      size="sm"
      variant="ghost"
      colorScheme="gray500"
      isSquare
      red500
      onClick={() => {
        if (isFavorite) {
          nodeService.removeFromFavorites()
        } else {
          nodeService.addToFavorites()
        }
      }}
    >
      {isFavorite ? (
        <IconStarSolid fillYellow500 />
      ) : (
        <IconStar stroke="#666" />
      )}
    </Button>
  )
}
