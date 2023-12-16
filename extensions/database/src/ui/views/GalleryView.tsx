import { PropsWithChildren } from 'react'
import { Box } from '@fower/react'

interface GalleryViewProps {}

export const GalleryView = ({
  children,
}: PropsWithChildren<GalleryViewProps>) => {
  return (
    <Box>
      <Box>Gallery view, coming soon...</Box>
    </Box>
  )
}
