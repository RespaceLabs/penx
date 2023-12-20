import { PropsWithChildren } from 'react'
import { Box } from '@fower/react'
import { useDatabaseContext } from '../DatabaseContext'

interface KanbanViewProps {}

export const KanbanView = ({
  children,
}: PropsWithChildren<KanbanViewProps>) => {
  const { currentView } = useDatabaseContext()
  console.log('==========currentView:', currentView)

  return (
    <Box>
      <Box>Kanban view, coming soon...</Box>
    </Box>
  )
}
