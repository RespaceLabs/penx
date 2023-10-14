import React, { FC, PropsWithChildren } from 'react'
import { Star, StarOffIcon } from 'lucide-react'
import { Button } from 'uikit'
import { useDoc } from '@penx/hooks'

interface Props {}

export const FavoriteButton: FC<PropsWithChildren<Props>> = () => {
  const { docService } = useDoc()
  const isFavorite = docService.isFavorite()
  return (
    <Button
      size="sm"
      variant="ghost"
      colorScheme="gray500"
      isSquare
      onClick={() => {
        if (isFavorite) {
          docService.removeFromFavorites()
        } else {
          docService.addToFavorites()
        }
      }}
    >
      {isFavorite ? <StarOffIcon /> : <Star />}
    </Button>
  )
}
