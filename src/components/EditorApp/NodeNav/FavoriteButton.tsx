import React, { FC, PropsWithChildren } from 'react'
import { Button } from '@/components/ui/button'
import { useNodeContext, useNodes } from '@/lib/node-hooks'
import { Star, StarOffIcon } from 'lucide-react'

interface Props {}

export const FavoriteButton: FC<PropsWithChildren<Props>> = () => {
  const { node } = useNodeContext()
  const { nodeList } = useNodes()

  if (!nodeList.favoriteNode) return
  const isFavorite = nodeList.isFavorite(node.id)
  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={() => {
        if (isFavorite) {
          nodeList.removeFromFavorites(node)
        } else {
          nodeList.addToFavorites(node)
        }
      }}
    >
      {isFavorite ? <Star size={20} /> : <StarOffIcon size={20} />}
    </Button>
  )
}
