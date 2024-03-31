import React from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Box } from '@fower/react'

type DraggableProps = {
  data: { dayKey: string; taskId: string | number }
  children: React.ReactNode
}

export const Draggable = ({ data, children }: DraggableProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: data.taskId,
    data: { dayKey: data.dayKey },
  })

  const style: React.CSSProperties | undefined = transform
    ? {
        transform: CSS.Translate.toString(transform),
      }
    : undefined

  return (
    <Box ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </Box>
  )
}
