import { PropsWithChildren, useRef, useState } from 'react'
import { Box } from '@fower/react'
import { useDatabaseContext } from '../../DatabaseContext'

type Items = Record<string, string[]>

type UniqueIdentifier = string

const defaultInitializer = (index: number) => index

export function createRange<T = number>(
  length: number,
  initializer: (index: number) => any = defaultInitializer,
): T[] {
  return [...new Array(length)].map((_, index) => initializer(index))
}

export const KanbanView = ({}) => {
  const { currentView } = useDatabaseContext()
  console.log('==========currentView:', currentView)
  const itemCount = 3

  const [items, setItems] = useState<Items>(() => ({
    A: createRange(itemCount, (index) => `A${index + 1}`),
    B: createRange(itemCount, (index) => `B${index + 1}`),
    C: createRange(itemCount, (index) => `C${index + 1}`),
    D: createRange(itemCount, (index) => `D${index + 1}`),
  }))
  const [containers, setContainers] = useState(
    Object.keys(items) as UniqueIdentifier[],
  )
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const lastOverId = useRef<UniqueIdentifier | null>(null)
  const recentlyMovedToNewContainer = useRef(false)
  const isSortingContainer = activeId ? containers.includes(activeId) : false

  return (
    <Box>
      <Box>Kanban view, coming soon...</Box>
    </Box>
  )
}
