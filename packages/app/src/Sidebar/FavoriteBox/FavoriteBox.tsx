import { useEffect, useState } from 'react'
import { Box } from '@fower/react'
import { MoreHorizontal } from 'lucide-react'
import { Button } from 'uikit'
import { useDocs, useSpaces } from '@penx/hooks'
import { DocItem } from './DocItem'

export const FavoriteBox = () => {
  const { docList } = useDocs()
  const { activeSpace } = useSpaces()

  return (
    <Box gray600 p3 bgWhite rounded2XL>
      <Box toCenterY toBetween gap2>
        <Box fontBold>Favorites</Box>
        <Button
          size="sm"
          variant="ghost"
          colorScheme="gray700"
          isSquare
          roundedFull
        >
          <MoreHorizontal />
        </Button>
      </Box>
      <Box column>
        {docList.getFavorites(activeSpace.favorites).map((doc) => (
          <DocItem key={doc.id} doc={doc} />
        ))}
      </Box>
    </Box>
  )
}
