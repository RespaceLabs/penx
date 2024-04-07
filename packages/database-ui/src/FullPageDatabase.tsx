import { PropsWithChildren, useCallback, useRef, useState } from 'react'
import { Box, css } from '@fower/react'
import {
  DataEditor,
  DataEditorRef,
  Rectangle,
} from '@glideapps/glide-data-grid'
import { Divider } from 'uikit'
import { DATABASE_TOOLBAR_HEIGHT, WORKBENCH_NAV_HEIGHT } from '@penx/constants'
import { Node } from '@penx/model'
import { DataSource } from '@penx/model-types'
import { AddColumnBtn } from './AddColumnBtn'
import { cellRenderers } from './cells'
import { DatabaseProvider, useDatabaseContext } from './DatabaseContext'
import { DeleteColumnModal } from './DeleteColumnModal'
import { TableView } from './TableView'
import { ViewList } from './ViewNav/ViewList'
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
