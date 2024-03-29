import React, { FC, PropsWithChildren } from 'react'
import { Button } from 'uikit'
import { useNodeContext, useNodes } from '@penx/hooks'
import { IconStar, IconStarSolid } from '@penx/icons'

interface Props {}

export const DatabaseFavoriteButton: FC<PropsWithChildren<Props>> = () => {
  const { node } = useNodeContext()
  const { nodeList } = useNodes()

  const isFavorite = nodeList.isFavoriteDatabase(node.id)
  return (
    <Button
      size={28}
      variant="ghost"
      colorScheme="gray500"
      isSquare
      red500
      p1
      onClick={() => {
        if (isFavorite) {
          nodeList.removeFromDatabaseFavorites(node)
        } else {
          nodeList.addToDatabaseFavorites(node)
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
