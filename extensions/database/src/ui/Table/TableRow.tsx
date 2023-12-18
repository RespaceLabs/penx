import { Box } from '@fower/react'
import { Bullet } from 'uikit'
import { ContextMenu, MenuItem, useContextMenu } from '@penx/context-menu'
import { db } from '@penx/local-db'
import { ICellNode, IColumnNode, IRowNode } from '@penx/model-types'
import { store } from '@penx/store'
import { FIRST_COL_WIDTH } from '../../constants'
import { useDatabaseContext } from '../DatabaseContext'
import { TableCell } from './Cell'

interface Props {
  index: number
  row: IRowNode
  columns: IColumnNode[]
  cells: ICellNode[]
}

export const TableRow = ({ columns = [], row, cells = [], index }: Props) => {
  const { deleteRow } = useDatabaseContext()

  // TODO: need to improve performance
  const rowCells = columns.map((column) => {
    return cells.find(
      (cell) =>
        cell.props.rowId === row.id && cell.props.columnId === column?.id,
    )!
  })

  const menuId = `row-${row.id}`
  const { show } = useContextMenu(menuId)

  async function clickBullet() {
    const primaryCell = rowCells.find((cell) => !!cell.props.ref)

    const node = await db.getNode(primaryCell?.props.ref!)
    if (node) store.node.selectNode(node)
  }

  return (
    <>
      <ContextMenu id={menuId}>
        <MenuItem
          onClick={() => {
            //
          }}
        >
          Insert above
        </MenuItem>
        <MenuItem
          onClick={() => {
            //
          }}
        >
          Insert below
        </MenuItem>
        <MenuItem
          onClick={() => {
            deleteRow(row.id)
          }}
        >
          Delete Row
        </MenuItem>
      </ContextMenu>
      <Box flex-1 toLeft className="gridRow" onContextMenu={show}>
        <Box
          className="grid-cell"
          inlineFlex
          toCenterY
          pl3
          px2
          w={FIRST_COL_WIDTH}
          // h-100p
          bgTransparent
          borderBottom
          borderLeft
          // borderRight
          flexShrink={0}
        >
          <Bullet
            invisible
            visible--$gridRow--hover
            bgTransparent
            style={{
              flexShrink: 0,
            }}
            onClick={clickBullet}
          />

          <Box as="input" type="checkbox" hidden inlineBlock--$gridRow--hover />
          <Box textXS inlineBlock hidden--$gridRow--hover>
            {(index || 0) + 1}
          </Box>
        </Box>

        {rowCells.map((cell, index) => (
          <TableCell
            key={cell?.id}
            cell={cell}
            columns={columns}
            index={index}
          />
        ))}
      </Box>
    </>
  )
}
