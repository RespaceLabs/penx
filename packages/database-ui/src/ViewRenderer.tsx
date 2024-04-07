import { ELEMENT_DATABASE_CONTAINER } from '@penx/constants'
import { ViewType } from '@penx/model-types'
import { useDatabaseContext } from './DatabaseContext'
import { GalleryView } from './views/GalleryView'
import { KanbanView } from './views/KanbanView/KanbanView'
import { ListView } from './views/ListView'
import { TableView } from './views/TableView/TableView'

interface Props {
  // element: DatabaseElement | DatabaseContainerElement
  element: any
}

export const ViewRenderer = ({ element }: Props) => {
  const { currentView } = useDatabaseContext()

  const isDatabaseContainer = element.type === ELEMENT_DATABASE_CONTAINER

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

  return (
    <TableView height={isDatabaseContainer ? 300 : `calc(100vh - 300px)`} />
  )
}
