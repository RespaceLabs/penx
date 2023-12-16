import { Box } from '@fower/react'
import { Divider } from 'uikit'
import { ElementProps } from '@penx/extension-typings'
import { DatabaseElement } from '../types'
import { DatabaseProvider } from './DatabaseContext'
import { AddViewBtn } from './ViewNav/AddViewBtn'
import { ViewList } from './ViewNav/ViewList'
import { ViewRenderer } from './ViewRenderer'
import { ViewToolBar } from './ViewToolBar/ViewToolBar'

export const Database = ({
  attributes,
  element,
  children,
}: ElementProps<DatabaseElement>) => {
  const { databaseId } = element

  return (
    <Box flex-1 {...attributes} contentEditable={false}>
      {children}

      <DatabaseProvider databaseId={databaseId}>
        <Box toCenterY gap8 mb2>
          <Box toCenterY gap2>
            <ViewList />
            <AddViewBtn />
          </Box>
          <Divider h-20 orientation="vertical" />
          <ViewToolBar />
        </Box>
        <ViewRenderer />
      </DatabaseProvider>
    </Box>
  )
}
