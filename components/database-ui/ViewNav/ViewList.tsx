'use client'

import { mappedByKey } from '@/lib/shared'
import { ViewType } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useDatabaseContext } from '../DatabaseProvider'
import { ViewIcon } from './ViewIcon'
import { ViewMenu } from './ViewMenu'

export const ViewList = () => {
  const { database, activeViewId, setActiveViewId } = useDatabaseContext()

  const { views } = database
  const { viewIds = [] } = database

  if (!database) return null

  const viewMap = mappedByKey(views, 'id')
  const sortedViews = viewIds.map((viewId) => viewMap[viewId])

  return (
    <div className="flex items-center gap-1">
      {sortedViews.map((view, index) => {
        if (!view) return null
        const active = activeViewId === view.id
        return (
          <div
            key={view.id}
            className={cn(
              'flex items-center justify-center cursor-pointer rounded text-foreground/60 hover:bg-foreground/5 h-7 px-3 gap-1',
              active && 'text-foreground/90 bg-foreground/5',
            )}
            onClick={async () => {
              setActiveViewId(view.id)
            }}
          >
            <ViewIcon viewType={view.viewType as any} />
            <div className="flex-shrink-0">{view.name}</div>
          </div>
        )
      })}
    </div>
  )
}
