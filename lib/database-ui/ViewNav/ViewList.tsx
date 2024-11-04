import { useDatabaseContext } from '@/lib/database-context'
import { db } from '@/lib/local-db'
import { IDatabaseNode, ViewType } from '@/lib/model'
import { mappedByKey } from '@/lib/shared'
import { cn } from '@/lib/utils'
import { ViewIcon } from './ViewIcon'
import { ViewMenu } from './ViewMenu'

export const ViewList = () => {
  const { views, database, activeViewId, setActiveViewId } =
    useDatabaseContext()

  if (!database) return null

  const { viewIds = [] } = database.props

  const viewMap = mappedByKey(views, 'id')
  const sortedViews = viewIds.map((viewId) => viewMap[viewId])

  return (
    <div className="flex items-center gap-1">
      {sortedViews.map((view, index) => {
        if (!view) return null
        if (view.props.viewType !== ViewType.TABLE) return null
        const active = activeViewId === view.id
        return (
          <div
            key={view.id}
            className={cn(
              'flex items-center cursor-pointer rounded text-foreground/60 hover:bg-foreground/5 h-8 pl-3 gap-1',
              active ? 'pr-1' : 'pr-3',
              active && 'text-foreground/90',
              active && 'bg-foreground/5',
            )}
            onClick={async () => {
              setActiveViewId(view.id)
              await db.updateNode<IDatabaseNode>(database.id, {
                props: {
                  ...database.props,
                  activeViewId: view.id,
                },
              })
            }}
          >
            <ViewIcon viewType={view.props.viewType} />
            <div flexShrink-0>{view.props.name}</div>
            {active && <ViewMenu view={view} index={index} />}
          </div>
        )
      })}
    </div>
  )
}
