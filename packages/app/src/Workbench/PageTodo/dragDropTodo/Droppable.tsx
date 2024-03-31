import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import { Box } from '@fower/react'

type DroppableProps = {
  id: string
  children: React.ReactNode
}

export const Droppable = ({ id, children }: DroppableProps) => {
  const { setNodeRef } = useDroppable({
    id,
  })

  // const style: React.CSSProperties = {
  //   backgroundColor: isOver ? "rgba(0, 255, 0, 0.3)" : undefined
  // };

  return <Box ref={setNodeRef}>{children}</Box>
}
