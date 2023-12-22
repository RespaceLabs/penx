import { ViewType } from '@penx/model-types'
import { useDatabaseContext } from './DatabaseContext'
import { GalleryView } from './views/GalleryView'
import { KanbanView } from './views/KanbanView/KanbanView'
import { ListView } from './views/ListView'
import { TableView } from './views/TableView/TableView'

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
