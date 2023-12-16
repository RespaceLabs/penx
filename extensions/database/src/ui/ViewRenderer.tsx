import { ViewType } from '@penx/model-types'
import { useDatabaseContext } from './DatabaseContext'
import { GalleryView } from './GalleryView'
import { KanbanView } from './KanbanView'
import { ListView } from './ListView'
import { TableView } from './TableView'

export const ViewRenderer = () => {
  const { currentView } = useDatabaseContext()

  if (!currentView) return null

  if (currentView.props.viewType === ViewType.LIST) {
    return <ListView />
  }

  if (currentView.props.viewType === ViewType.KANBAN) {
    return <KanbanView />
  }

  if (currentView.props.viewType === ViewType.GALLERY) {
    return <GalleryView />
  }

  return <TableView />
}
