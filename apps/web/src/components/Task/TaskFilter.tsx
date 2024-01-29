import { Box } from '@fower/react'
import { Tag } from 'uikit'

export function TaskFilter() {
  return (
    <Box toCenterY gap2>
      <Tag size={40} colorScheme="black" cursorPointer>
        All
      </Tag>
      <Tag
        size={40}
        colorScheme="black"
        variant="outline"
        border-2
        cursorPointer
      >
        Available
      </Tag>
      <Tag
        size={40}
        colorScheme="black"
        variant="outline"
        border-2
        cursorPointer
      >
        Completed
      </Tag>
    </Box>
  )
}
