import { PropsWithChildren, useCallback, useState } from 'react'
import { useLayer } from 'react-laag'
import { Box, css } from '@fower/react'
import {
  DataEditor,
  GridCell,
  GridCellKind,
  GridColumn,
  Item,
  Rectangle,
} from '@glideapps/glide-data-grid'
import { useDatabaseContext } from '../../DatabaseContext'
import { TableBody } from '../../Table/TableBody'
import { TableHeader } from '../../Table/TableHeader'
import { AddColumnBtn } from './AddColumnBtn'
import { cellRenderers } from './cells'
import { ColumnMenu } from './ColumnMenu'
import { DeleteColumnModal } from './DeleteColumnModal'
import { useTableView } from './useTableView'

export const TableView = () => {
  const { rows, sortedColumns } = useDatabaseContext()

  const {
    cols,
    getContent,
    onCellEdited,
    onColumnResize,
    onColumnResizeEnd,
    onDeleteColumn,
  } = useTableView()

  const [menu, setMenu] = useState<{
    col: number
    bounds: Rectangle
  }>()

  const isOpen = menu !== undefined
  const { layerProps, renderLayer } = useLayer({
    isOpen,
    auto: true,
    placement: 'bottom-end',
    triggerOffset: 2,
    onOutsideClick: () => setMenu(undefined),
    trigger: {
      getBounds: () => ({
        left: menu?.bounds.x ?? 0,
        top: menu?.bounds.y ?? 0,
        width: menu?.bounds.width ?? 0,
        height: menu?.bounds.height ?? 0,
        right: (menu?.bounds.x ?? 0) + (menu?.bounds.width ?? 0),
        bottom: (menu?.bounds.y ?? 0) + (menu?.bounds.height ?? 0),
      }),
    },
  })

  const onHeaderMenuClick = useCallback((col: number, bounds: Rectangle) => {
    setMenu({ col, bounds })
  }, [])

  return (
    <Box>
      {/* <Box mb2>
        <TableHeader />
        <TableBody />
      </Box> */}

      <DeleteColumnModal onDeleteColumn={onDeleteColumn} />

      <DataEditor
        className={css('roundedXL shadowPopover')}
        columns={cols}
        rows={rows.length}
        freezeColumns={1}
        smoothScrollX
        smoothScrollY
        // height={200}
        height={`calc(100vh - 300px)`}
        width={`calc(100vw - 360px)`}
        rowMarkers="number"
        getCellsForSelection={true}
        onPaste
        rightElement={<AddColumnBtn />}
        customRenderers={cellRenderers}
        getCellContent={getContent}
        onCellEdited={onCellEdited}
        onColumnResize={onColumnResize}
        onColumnResizeEnd={onColumnResizeEnd}
        onHeaderMenuClick={onHeaderMenuClick}
        onCellContextMenu={(cell, e) => {
          // console.log('cell-------:, cell:', cell, e)
          e.preventDefault()
        }}
        onHeaderClicked={() => {
          // console.log('click')
        }}
        // trailingRowOptions={{
        //   // How to get the trailing row to look right
        //   sticky: true,
        //   tint: true,
        //   hint: 'New row...',
        // }}
        // onRowAppended={() => {}}
      />
      {isOpen &&
        renderLayer(
          <Box {...layerProps} shadowPopover bgWhite roundedLG overflowHidden>
            <ColumnMenu
              index={menu.col}
              column={sortedColumns[menu.col]}
              close={() => setMenu(undefined)}
            />
          </Box>,
        )}
    </Box>
  )
}
