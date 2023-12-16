import { PropsWithChildren } from 'react'
import { Box } from '@fower/react'

interface KanbanViewProps {}

export const KanbanView = ({
  children,
}: PropsWithChildren<KanbanViewProps>) => {
  return (
    <Box>
      <Box>Kanban view, coming soon...</Box>
    </Box>
  )
}
