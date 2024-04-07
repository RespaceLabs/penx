import { Box } from '@fower/react'
import { InlineDatabase } from '@penx/database-ui'
import { useEditorStatic } from '@penx/editor-common'
import { ElementProps } from '@penx/extension-typings'
import { DatabaseElement } from '../types'

export const Database = ({
  attributes,
  element,
  children,
}: ElementProps<DatabaseElement>) => {
  const { databaseId } = element

  const editor = useEditorStatic()
  const node = editor.items.find((item) => item.id === databaseId)!

  return (
    <Box flex-1 {...attributes} contentEditable={false}>
      {children}

      <InlineDatabase node={node} />
    </Box>
  )
}
