import React, { FC, PropsWithChildren } from 'react'
import { Star, StarOffIcon } from 'lucide-react'
import { Button } from 'uikit'
import { usePage } from '@penx/hooks'

interface Props {}

export const FavoriteButton: FC<PropsWithChildren<Props>> = () => {
  const { nodeService } = usePage()
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
