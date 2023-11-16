import React, { FC, PropsWithChildren } from 'react'
import { Button } from 'uikit'
import { useNode, useNodes } from '@penx/hooks'
import { IconStar, IconStarSolid } from '@penx/icons'

interface Props {}

export const FavoriteButton: FC<PropsWithChildren<Props>> = () => {
  const { node } = useNode()
  const { nodeList } = useNodes()
  const isFavorite = nodeList.isFavorite(node.id)
  return (
    <Button
      size="sm"
      variant="ghost"
      colorScheme="gray500"
      isSquare
      red500
      onClick={() => {
        if (isFavorite) {
          nodeList.removeFromFavorites(node)
        } else {
          nodeList.addToFavorites(node)
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
