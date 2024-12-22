'use client'

import { useCallback } from 'react'
import { isMobile } from 'react-device-detect'
import { useTheme } from 'next-themes'
import { cellRenderers } from '@/components/cells'
import { SIDEBAR_WIDTH } from '@/lib/constants'
import { getDataEditorTheme } from '@/lib/getDataEditorTheme'
import {
  DataEditor,
  DataEditorRef,
  Rectangle,
} from '@glideapps/glide-data-grid'
import { useDatabaseContext } from '../../DatabaseProvider'
import { AddColumnBtn } from './AddColumnBtn'
import { ConfigFieldDialog } from './ConfigFieldDialog/ConfigFieldDialog'
import { DeleteFieldDialog } from './DeleteFieldDialog/DeleteFieldDialog'
import { useCellMenu } from './hooks/useCellMenu'
import { useColumnMenu } from './hooks/useColumnMenu'
import { useTableView } from './hooks/useTableView'
import { useUndoRedo } from './use-undo-redo'

interface Props {
  width?: number | string
  height: number | string
}

export const TableView = ({ height, width }: Props) => {
  const { database } = useDatabaseContext()
  const { theme } = useTheme()

  const {
    gridRef,
    rowsNum,
    cols,
    sortedFields,
    getContent,
    setCellValue,
    onColumnResize,
    onColumnResizeEnd,
    onDeleteField: onDeleteColumn,
    onRowAppended,
  } = useTableView()

  const {
    gridSelection,
    onGridSelectionChange,
    onCellEdited,
    undo,
    canRedo,
    canUndo,
    redo,
  } = useUndoRedo(gridRef, getContent, setCellValue)

  const { setColumnMenu, columnMenuUI } = useColumnMenu(sortedFields)
  const { setCellMenu, cellMenuUI } = useCellMenu()

  const onHeaderMenuClick = useCallback(
    (col: number, bounds: Rectangle) => {
      console.log('headerMenuClick', col, bounds)
      setColumnMenu({ col, bounds })
    },
    [setColumnMenu],
  )

  const isDark = theme === 'dark'

  return (
    <div className="">
      <DeleteFieldDialog onDeleteField={onDeleteColumn} />
      <ConfigFieldDialog />
      <DataEditor
        ref={gridRef}
        className="shadow rounded-xl"
        columns={cols}
        rows={rowsNum}
        freezeColumns={isMobile ? undefined : 1}
        theme={getDataEditorTheme(isDark)}
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
        onCellContextMenu={(cell, e) => {
          setCellMenu({ row: database.records[cell[1]], bounds: e.bounds })
          e.preventDefault()
        }}
        onHeaderClicked={(index, event) => {
          // if (isMobile) {
          //   modalController.open(ModalNames.CONFIG_COLUMN, {
          //     index,
          //     column: sortedColumns[index],
          //   })
          // }
        }}
        trailingRowOptions={{
          // How to get the trailing row to look right
          sticky: true,
          tint: true,
          hint: 'New row...',
        }}
        onRowAppended={onRowAppended}
      />
      {cellMenuUI}
      {columnMenuUI}
    </div>
  )
}
