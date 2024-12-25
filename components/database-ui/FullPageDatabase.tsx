'use client'

import { DATABASE_TOOLBAR_HEIGHT, WORKBENCH_NAV_HEIGHT } from '@/lib/constants'
import { Separator } from '../ui/separator'
import { DatabaseProvider } from './DatabaseProvider'
import { TableName } from './TableName'
import { AddViewBtn } from './ViewNav/AddViewBtn'
import { ViewList } from './ViewNav/ViewList'
import { ViewRenderer } from './ViewRenderer'
import { ViewToolBar } from './ViewToolBar/ViewToolBar'

export const FullPageDatabase = () => {
  return (
    <DatabaseProvider>
      <div className="flex flex-col px-0 sm:px-3">
        <div
          className="w-full flex items-center justify-between gap-8"
          style={{ height: DATABASE_TOOLBAR_HEIGHT }}
        >
          <div className="flex items-center gap-2">
            <TableName />
            <ViewList />
            <AddViewBtn />
          </div>
          <div className="hidden md:block">
            {/* <Separator orientation="vertical" className="h-5" /> */}
            <ViewToolBar />
          </div>
        </div>
        <ViewRenderer />
      </div>
    </DatabaseProvider>
  )
}
