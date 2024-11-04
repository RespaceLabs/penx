import { InlineDatabase } from '@/lib/database-ui'
import { useEditorStatic } from '@/lib/editor-common'
import { ElementProps } from '@/lib/extension-typings'
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
    <div className="flex-1" {...attributes} contentEditable={false}>
      {children}

      <InlineDatabase node={node} />
    </div>
  )
}
