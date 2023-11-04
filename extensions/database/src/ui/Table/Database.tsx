import { useCallback, useEffect } from 'react'
import { Box } from '@fower/react'
import { Button } from 'uikit'
import { ElementProps } from '@penx/extension-typings'
import { db } from '@penx/local-db'
import { DatabaseElement } from '../../types'

export const Database = ({
  attributes,
  element,
  children,
}: ElementProps<DatabaseElement>) => {
  const initTable = useCallback(async (id: string) => {
    const database = await db.getDatabase(id)
    console.log('database.....:', database)
  }, [])

  useEffect(() => {
    initTable(element.databaseId)
  }, [element, initTable])

  return (
    <Box flex-1 mb8 mt8 {...attributes}>
      <Box relative inlineBlock>
        <Button>FOO</Button>
        {children}
      </Box>
    </Box>
  )
}
