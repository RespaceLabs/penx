import { DATABASE_TOOLBAR_HEIGHT, WORKBENCH_NAV_HEIGHT } from '@/lib/constants'
import { DatabaseProvider, WithStoreDatabase } from '@/lib/database-context'
import { Node } from '@/lib/model'
import { TagMenu } from './TagMenu/TagMenu'
import { ViewList } from './ViewNav/ViewList'
import { TableView } from './views/TableView/TableView'
import { ViewToolBar } from './ViewToolBar/ViewToolBar'

interface Props {
  node: Node
}

export const FullPageDatabase = ({ node }: Props) => {
  return (
    <WithStoreDatabase databaseId={node.id}>
      {(databaseInfo) => (
        <DatabaseProvider {...databaseInfo}>
          <div className="flex flex-col sm:px-3">
            <div
              className="w-full flex justify-between gap-8"
              style={{
                height: DATABASE_TOOLBAR_HEIGHT,
              }}
            >
              <div className="flex items-center gap-2">
                <TagMenu />
                <ViewList />
                {/* <AddViewBtn /> */}
              </div>
              <ViewToolBar />
            </div>
            <TableView
              height={`calc(100vh - ${WORKBENCH_NAV_HEIGHT + DATABASE_TOOLBAR_HEIGHT + 2}px)`}
            />
          </div>
        </DatabaseProvider>
      )}
    </WithStoreDatabase>
  )
}
