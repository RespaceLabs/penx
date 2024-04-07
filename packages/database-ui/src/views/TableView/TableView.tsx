import { PropsWithChildren, useCallback, useRef, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { Box, css } from '@fower/react'
import {
  DataEditor,
  DataEditorRef,
  Rectangle,
} from '@glideapps/glide-data-grid'
import {
  ELEMENT_DATABASE_CONTAINER,
  SIDEBAR_WIDTH,
  TODO_DATABASE_NAME,
} from '@penx/constants'
import { useDatabaseContext } from '../../DatabaseContext'
import { AddColumnBtn } from './AddColumnBtn'
import { cellRenderers } from './cells'
import { DeleteColumnModal } from './DeleteColumnModal'
import { useCellMenu } from './hooks/useCellMenu'
import { useColumnMenu } from './hooks/useColumnMenu'
import { useTableView } from './hooks/useTableView'
import { useUndoRedo } from './use-undo-redo'

interface Props {
  width?: number | string
  height: number | string
}

export const TableView = ({ height, width }: Props) => {
  const { database, sortedColumns } = useDatabaseContext()
  const isTodo = database.props.name === TODO_DATABASE_NAME
  const canNewRow = !isTodo

  const {
    rowsNum,
    cols,
    filterRows,
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
      console.log('headerMenuClick', col, bounds)

      setColumnMenu({ col, bounds })
    },
    [setColumnMenu],
  )

  return (
    <Box borderTop-2>
      <DeleteColumnModal onDeleteColumn={onDeleteColumn} />

      <DataEditor
        ref={gridRef}
        // className={css('roundedXL shadowPopover')}
        columns={cols}
        rows={rowsNum}
        freezeColumns={isMobile ? undefined : 1}
        theme={{
          bgHeader: 'white',
        }}
        smoothScrollX
        smoothScrollY
        height={height}
        width={
          width ||
          (isMobile ? '100vw' : `calc(100vw - ${SIDEBAR_WIDTH + 30}px)`)
        }
        // width={`calc(100vw)`}
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
          canNewRow
            ? (cell, e) => {
                setCellMenu({ row: filterRows[cell[1]], bounds: e.bounds })
                e.preventDefault()
              }
            : undefined
        }
        onHeaderClicked={(...args) => {
          console.log('click header...:', args)
        }}
        trailingRowOptions={
          canNewRow
            ? {
                // How to get the trailing row to look right
                sticky: true,
                tint: true,
                hint: 'New row...',
              }
            : {}
        }
        onRowAppended={canNewRow ? onRowAppended : undefined}
      />
      {canNewRow && cellMenuUI}
      {columnMenuUI}
    </Box>
  )
}
