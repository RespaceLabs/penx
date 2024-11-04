import { Bullet } from '@/components/Bullet'
import { useDatabaseContext } from '@/lib/database-context'
import { db } from '@/lib/local-db'
import { IRowNode } from '@/lib/model'
import { store } from '@/store'


export const ListView = () => {
  const { rows } = useDatabaseContext()
  return (
    <div>
      {rows.map((row) => (
        <ListItem key={row.id} row={row} />
      ))}
    </div>
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

  const column = !primaryCell
    ? columns[0]
    : columns.find((column) => column.id === primaryCell.props.columnId)!

  async function clickBullet() {
    const node = await db.getNode(primaryCell?.props.ref!)
    if (node) store.node.selectNode(node)
  }

  return (
    <div className="flex items-center">
      <Bullet dashed outlineColor="transparent" onClick={clickBullet} />
    </div>
  )
}
