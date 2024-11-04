import { forwardRef } from 'react'
import {
  isListContentElement,
  ListContentElement,
} from '@/editor-extensions/list'
import { CellField } from '@/lib/cell-fields'
import { useDatabaseContext } from '@/lib/database-context'
import { useEditorStatic } from '@/lib/editor-common'
import { useDatabase } from '@/lib/node-hooks'
import { mappedByKey } from '@/lib/shared'

import { Editor, Path } from 'slate'
import { FieldIcon } from '../shared/FieldIcon'

interface Props {
  databaseId: string

  path: Path // tag path
}

export const TagForm = forwardRef<HTMLDivElement, Props>(function TagForm(
  { databaseId, path },
  ref,
) {
  const { currentView } = useDatabaseContext()
  const { columns, views, cells } = useDatabase(databaseId)

  const columnMap = mappedByKey(columns, 'id')
  const { viewColumns = [] } = currentView.props
  const sortedColumns = viewColumns.map(({ columnId }) => columnMap[columnId])

  const editor = useEditorStatic()

  const [blockEntry] = Editor.nodes(editor, {
    at: path,
    mode: 'lowest',
    match: (n) =>
      editor.isOutliner
        ? isListContentElement(n)
        : Editor.isBlock(editor, n as any),
  })

  const blockElement = blockEntry?.[0] as ListContentElement

  if (!blockElement) return null

  const refCell = cells.find((cell) => cell.props.ref === blockElement.id)
  if (!refCell) return null

  const rowId = refCell.props.rowId

  const rowCells = sortedColumns.map((column) => {
    return cells.find(
      (cell) => cell.props.rowId === rowId && cell.props.columnId === column.id,
    )!
  })

  return (
    <div ref={ref}>
      <div className="font-semibold h-12 px-6 flex items-center border-b">
        Update Metadata for this Node
      </div>

      <div className="flex flex-col gap-4 p-6 max-h-[400px] overflow-y-auto">
        {rowCells.map((cell, index) => {
          if (cell.props.ref === blockElement.id) return null

          const column = columns.find((col) => col.id === cell.props.columnId)!

          return (
            <div key={cell.id}>
              <div className="flex items-center gap-1 text-foreground/60 mb-2">
                <FieldIcon fieldType={column.props.fieldType} />
                <div className="text-xs">{column.props.displayName}</div>
              </div>

              <CellField index={index} cell={cell} columns={sortedColumns} />
            </div>
          )
        })}
      </div>
    </div>
  )
})
