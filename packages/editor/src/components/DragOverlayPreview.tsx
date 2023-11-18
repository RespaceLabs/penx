import { Box } from '@fower/react'
import { Node, WithFlattenedProps } from '@penx/model'

interface Props {
  item: WithFlattenedProps<Node>
}

export function DragOverlayPreview({ item }: Props) {
  return (
    <Box
      h-30
      // w-100p
      toCenterY
      rounded
      opacity-80
    >
      {item.title || 'Untitled'}
    </Box>
  )
}
