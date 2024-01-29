import { Box } from '@fower/react'
import { Tag } from 'uikit'
import { TaskStatus, useTaskFilter } from './useTaskFilter'

export function TaskFilter() {
  const { filter, setFilter } = useTaskFilter()
  return (
    <Box toCenterY gap2>
      <Tag
        size={40}
        variant={filter === TaskStatus.ALL ? 'filled' : 'outline'}
        colorScheme="black"
        cursorPointer
        border-2={filter !== TaskStatus.ALL}
        onClick={() => setFilter(TaskStatus.ALL)}
      >
        All
      </Tag>
      <Tag
        size={40}
        colorScheme="black"
        variant={filter === TaskStatus.AVAILABLE ? 'filled' : 'outline'}
        border-2={filter !== TaskStatus.AVAILABLE}
        cursorPointer
        onClick={() => setFilter(TaskStatus.AVAILABLE)}
      >
        Available
      </Tag>
      <Tag
        size={40}
        colorScheme="black"
        variant={filter === TaskStatus.COMPLETED ? 'filled' : 'outline'}
        border-2={filter !== TaskStatus.COMPLETED}
        cursorPointer
        onClick={() => setFilter(TaskStatus.COMPLETED)}
      >
        Completed
      </Tag>
    </Box>
  )
}
