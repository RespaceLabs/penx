import React, { FC, PropsWithChildren } from 'react'
import { Star, StarOffIcon } from 'lucide-react'
import { Button } from 'uikit'
import { useNode } from '@penx/hooks'

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
      onClick={() => {
        if (isFavorite) {
          nodeService.removeFromFavorites()
        } else {
          nodeService.addToFavorites()
        }
      }}
    >
      {isFavorite ? <StarOffIcon /> : <Star />}
    </Button>
  )
}
