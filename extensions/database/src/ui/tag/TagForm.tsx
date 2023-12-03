import { forwardRef } from 'react'
import { Box } from '@fower/react'
import { Editor, Path } from 'slate'
import { Input } from 'uikit'
import { useEditorStatic } from '@penx/editor-common'
import { useDatabase } from '@penx/hooks'
import { isListContentElement, ListContentElement } from '@penx/list'
import { ViewType } from '@penx/model-types'
import { CellField } from '../fields'

interface Props {
  databaseId: string

  path: Path // tag path
}

export const TagForm = forwardRef<HTMLDivElement, Props>(function TagForm(
  { databaseId, path },
  ref,
) {
  const { columns, views, cells } = useDatabase(databaseId)
  const tableView = views.find(
    (view) => view.props.viewType === ViewType.Table,
  )!

  const sortedColumns = tableView.children.map(
    (id) => columns.find((col) => col.id === id)!,
  )

  const editor = useEditorStatic()

  const [licEntry] = Editor.nodes(editor, {
    at: path,
    mode: 'lowest',
    match: isListContentElement,
  })

  const lic = licEntry?.[0] as ListContentElement

  if (!lic) return null

  const refCell = cells.find((cell) => cell.props.ref === lic.id)
  if (!refCell) return null

  const rowId = refCell.props.rowId

  const rowCells = sortedColumns.map((column) => {
    return cells.find(
      (cell) => cell.props.rowId === rowId && cell.props.columnId === column.id,
    )!
  })

  return (
    <Box ref={ref} column p6 gap3>
      <Box fontSemibold textLG>
        Update Metadata for this Node
      </Box>

      {rowCells.map((cell, index) => {
        if (cell.props.ref === lic.id) return null

        const column = columns.find((col) => col.id === cell.props.columnId)!

        return (
          <Box key={cell.id}>
            <Box mb2>{column.props.name}</Box>
            <CellField index={index} cell={cell} columns={sortedColumns} />
          </Box>
        )
      })}
    </Box>
  )
})
