import { memo } from 'react'
import isEqual from 'react-fast-compare'
import { db } from '@penx/local-db'
import { FieldType, ICellNode, IColumnNode } from '@penx/model-types'
import { store } from '@penx/store'
import { CreatedAtCell } from './CreatedAt'
import { MultipleSelectCell } from './MultipleSelect'
import { NumberCell } from './Number'
import { PasswordCell } from './Password'
import { SingleSelectCell } from './SingleSelect'
import { TextCell } from './Text'
import { UpdatedAtCell } from './UpdatedAt'

const cellsMap: Record<FieldType, any> = {
  Text: TextCell,
  Number: NumberCell,
  Password: PasswordCell,
  SingleSelect: SingleSelectCell,
  MultipleSelect: MultipleSelectCell,
  CreatedAt: CreatedAtCell,
  UpdatedAt: UpdatedAtCell,
}

interface Props {
  index: number
  columns: IColumnNode[]
  cell: ICellNode
}

export const CellField = memo(
  function TableCell({ columns, cell, index }: Props) {
    const { rowId, columnId } = cell.props
    const column = columns.find((c) => c.id === columnId)!
    const fieldType = column.props.fieldType
    const CellComponent = cellsMap[fieldType as FieldType]

    async function updateCell(data: any) {
      await db.updateNode(cell.id, {
        props: { ...cell.props, data },
      })

      const nodes = await db.listNodesBySpaceId(cell.spaceId)
      store.node.setNodes(nodes)
    }

    return (
      <CellComponent
        cell={cell}
        updateCell={updateCell}
        index={index}
        column={column}
      />
    )
  },
  (prev, next) => {
    return isEqual({ cell: prev.cell }, { cell: next.cell })
  },
)
