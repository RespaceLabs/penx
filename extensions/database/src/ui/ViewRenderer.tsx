import { ViewType } from '@penx/model-types'
import { useDatabaseContext } from './DatabaseContext'
import { ListView } from './ListView'
import { TableView } from './TableView'

export const ViewRenderer = () => {
  const { currentView } = useDatabaseContext()

  if (!currentView) return null

  if (currentView.props.viewType === ViewType.List) {
    return <ListView />
  }

  return <TableView />
}
