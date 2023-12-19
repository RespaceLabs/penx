import { Box } from '@fower/react'
import { Bullet } from 'uikit'
import { db } from '@penx/local-db'
import { IRowNode } from '@penx/model-types'
import { store } from '@penx/store'
import { useDatabaseContext } from '../DatabaseContext'
import { PrimaryCell } from '../Table/Cell/PrimaryCell'

export const ListView = () => {
  const { rows } = useDatabaseContext()
  return (
    <Box>
      {rows.map((row) => (
        <ListItem key={row.id} row={row} />
      ))}
    </Box>
  )
}

interface ListItemProps {
  row: IRowNode
}
function ListItem({ row }: ListItemProps) {
  const { cells, columns } = useDatabaseContext()
  const primaryCell = cells.find(
    (cell) => !!cell.props.ref && cell.props.rowId === row.id,
  )!

  const column = columns.find(
    (column) => column.id === primaryCell.props.columnId,
  )!

  async function clickBullet() {
    const node = await db.getNode(primaryCell?.props.ref!)
    if (node) store.node.selectNode(node)
  }

  return (
    <Box toCenterY>
      <Bullet
        dashed
        outlineColor="transparent"
        borderNeutral400
        style={{
          flexShrink: 0,
        }}
        onClick={clickBullet}
      />

      <PrimaryCell
        index={0}
        cell={primaryCell}
        column={column}
        width={0}
        selected={false}
        updateCell={() => {}}
        editorAtomicStyle="py-2"
        flex
      />
    </Box>
  )
}
