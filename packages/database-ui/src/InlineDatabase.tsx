import { PropsWithChildren, useCallback, useRef, useState } from 'react'
import { Box, css } from '@fower/react'
import { Divider } from 'uikit'
import { DATABASE_TOOLBAR_HEIGHT, WORKBENCH_NAV_HEIGHT } from '@penx/constants'
import { Node } from '@penx/model'
import { AddColumnBtn } from './AddColumnBtn'
import { cellRenderers } from './cells'
import { DatabaseProvider, useDatabaseContext } from './DatabaseContext'
import { TableView } from './TableView'
import { ViewList } from './ViewNav/ViewList'
import { ViewToolBar } from './ViewToolBar/ViewToolBar'

interface Props {
  node: Node
}

export const InlineDatabase = ({ node }: Props) => {
  return (
    <DatabaseProvider databaseId={node.id}>
      <Box toLeft column gap0>
        <Box toCenterY gap8 h={DATABASE_TOOLBAR_HEIGHT} mb2 px4>
          <Box toCenterY gap2>
            <ViewList />
            {/* <AddViewBtn /> */}
          </Box>
          <Divider h-20 orientation="vertical" />
          <ViewToolBar />
        </Box>
        <Box w-100p border>
          <TableView height={300} width="100%" />
        </Box>
      </Box>
    </DatabaseProvider>
  )
}
