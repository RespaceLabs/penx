import { forwardRef } from 'react'
import { Box } from '@fower/react'
import { Editor, Path } from 'slate'
import { useEditorStatic } from '@penx/editor-common'
import { isListContentElement, ListContentElement } from '@penx/list'
import { useDatabase } from '@penx/node-hooks'
import { mappedByKey } from '@penx/shared'
import { useDatabaseContext } from '../DatabaseContext'
import { FieldIcon } from '../shared/FieldIcon'
import { CellField } from './fields'

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
    <Box ref={ref} column>
      <Box fontSemibold h-48 px6 toCenterY borderBottom>
        Update Metadata for this Node
      </Box>

      <Box column gap4 p6 maxH-400 overflowYAuto>
        {rowCells.map((cell, index) => {
          if (cell.props.ref === blockElement.id) return null

          const column = columns.find((col) => col.id === cell.props.columnId)!

          return (
            <Box key={cell.id}>
              <Box mb2 toCenterY gap1 gray600>
                <FieldIcon fieldType={column.props.fieldType} />
                <Box textXS>{column.props.name}</Box>
              </Box>

              <CellField index={index} cell={cell} columns={sortedColumns} />
            </Box>
          )
        })}
      </Box>
    </Box>
  )
})
