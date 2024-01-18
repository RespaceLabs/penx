import { PropsWithChildren, useCallback, useRef, useState } from 'react'
import { Box, css } from '@fower/react'
import {
  DataEditor,
  DataEditorRef,
  Rectangle,
} from '@glideapps/glide-data-grid'
import { ELEMENT_DATABASE_CONTAINER } from '@penx/constants'
import { DataSource } from '@penx/model-types'
import { DatabaseContainerElement, DatabaseElement } from '../../../types'
import { useDatabaseContext } from '../../DatabaseContext'
import { AddColumnBtn } from './AddColumnBtn'
import { cellRenderers } from './cells'
import { DeleteColumnModal } from './DeleteColumnModal'
import { useCellMenu } from './hooks/useCellMenu'
import { useColumnMenu } from './hooks/useColumnMenu'
import { useTableView } from './hooks/useTableView'
import { useUndoRedo } from './use-undo-redo'

interface Props {
  element: DatabaseElement | DatabaseContainerElement
}

export const TableView = ({ element }: Props) => {
  const { database, rows, sortedColumns } = useDatabaseContext()

  const isDatabaseContainer = element.type === ELEMENT_DATABASE_CONTAINER
  const isTagDataSource = database.props.dataSource === DataSource.TAG

  const {
    rowsNum,
    cols,
    getContent,
    setCellValue,
    onColumnResize,
    onColumnResizeEnd,
    onDeleteColumn,
    onRowAppended,
  } = useTableView()

  const gridRef = useRef<DataEditorRef>(null)
  const {
    gridSelection,
    onGridSelectionChange,
    onCellEdited,
    undo,
    canRedo,
    canUndo,
    redo,
  } = useUndoRedo(gridRef, getContent, setCellValue)

  const { setColumnMenu, columnMenuUI } = useColumnMenu(sortedColumns)
  const { setCellMenu, cellMenuUI } = useCellMenu()

  const onHeaderMenuClick = useCallback(
    (col: number, bounds: Rectangle) => {
      setColumnMenu({ col, bounds })
    },
    [setColumnMenu],
  )

  return (
    <Box>
      <DeleteColumnModal onDeleteColumn={onDeleteColumn} />

      <DataEditor
        ref={gridRef}
        className={css('roundedXL shadowPopover')}
        columns={cols}
        rows={rowsNum}
        freezeColumns={1}
        smoothScrollX
        smoothScrollY
        height={isDatabaseContainer ? 300 : `calc(100vh - 300px)`}
        width={`calc(100vw - 360px)`}
        rowMarkers="number"
        getCellsForSelection={true}
        onPaste
        rightElement={<AddColumnBtn />}
        customRenderers={cellRenderers}
        getCellContent={getContent}
        onCellEdited={onCellEdited}
        gridSelection={gridSelection ?? undefined}
        onGridSelectionChange={onGridSelectionChange}
        onColumnResize={onColumnResize}
        onColumnResizeEnd={onColumnResizeEnd}
        onHeaderMenuClick={onHeaderMenuClick}
        onCellContextMenu={
          isTagDataSource
            ? undefined
            : (cell, e) => {
                // console.log('cell:', cell, e)
                setCellMenu({ row: rows[cell[1]], bounds: e.bounds })
                e.preventDefault()
              }
        }
        onHeaderClicked={() => {
          // console.log('click')
        }}
        trailingRowOptions={
          isTagDataSource
            ? {}
            : {
                // How to get the trailing row to look right
                sticky: true,
                tint: true,
                hint: 'New row...',
              }
        }
        onRowAppended={isTagDataSource ? undefined : onRowAppended}
      />
      {!isTagDataSource && cellMenuUI}
      {columnMenuUI}
    </Box>
  )
}
