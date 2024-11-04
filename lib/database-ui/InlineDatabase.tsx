import { DATABASE_TOOLBAR_HEIGHT } from '@/lib/constants'
import { DatabaseProvider, WithStoreDatabase } from '@/lib/database-context'
import { Node } from '@/lib/model'
import { ViewList } from './ViewNav/ViewList'
import { TableView } from './views/TableView/TableView'
import { ViewToolBar } from './ViewToolBar/ViewToolBar'

interface Props {
  node: Node
}

export const InlineDatabase = ({ node }: Props) => {
  return (
    <WithStoreDatabase databaseId={node.id}>
      {(databaseInfo) => (
        <DatabaseProvider {...databaseInfo}>
          <div className="flex flex-col">
            <div
              className="flex items-center gap-8 mb-2 px-4"
              style={{ height: DATABASE_TOOLBAR_HEIGHT }}
            >
              <div className="flex items-center gap-2">
                <ViewList />
                {/* <AddViewBtn /> */}
              </div>
              <ViewToolBar />
            </div>
            <div className="w-full border">
              <TableView height={300} width="100%" />
            </div>
          </div>
        </DatabaseProvider>
      )}
    </WithStoreDatabase>
  )
}
