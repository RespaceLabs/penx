import { Box } from '@fower/react'
import { Divider } from 'uikit'
import { DATABASE_TOOLBAR_HEIGHT, WORKBENCH_NAV_HEIGHT } from '@penx/constants'
import { Node } from '@penx/model'
import { DatabaseProvider } from './DatabaseContext'
import { TagMenu } from './TagMenu'
import { ViewList } from './ViewNav/ViewList'
import { TableView } from './views/TableView/TableView'
import { ViewToolBar } from './ViewToolBar/ViewToolBar'

interface Props {
  node: Node
}

export const FullPageDatabase = ({ node }: Props) => {
  return (
    <DatabaseProvider databaseId={node.id}>
      <Box toLeft column px={[0, 0, 12]} gap0>
        <Box toCenterY gap8 h={DATABASE_TOOLBAR_HEIGHT} mb2 px4>
          <Box toCenterY gap2>
            <TagMenu />
            <ViewList />
            {/* <AddViewBtn /> */}
          </Box>
          <Divider h-20 orientation="vertical" />
          <ViewToolBar />
        </Box>
        <TableView
          height={`calc(100vh - ${WORKBENCH_NAV_HEIGHT + DATABASE_TOOLBAR_HEIGHT + 12}px)`}
        />
      </Box>
    </DatabaseProvider>
  )
}
