import { memo } from 'react'
import isEqual from 'react-fast-compare'
import { css } from '@fower/react'
import { motion } from 'framer-motion'
import { db } from '@penx/local-db'
import { FieldType, ICellNode, IColumnNode } from '@penx/model-types'
import { columnWidthMotion } from '../../../columnWidthMotion'
import { CreatedAtCell } from './CreatedAt'
import { MultipleSelect } from './MultipleSelect'
import { NumberCell } from './Number'
import { PasswordCell } from './Password'
import { SingleSelectCell } from './SingleSelect'
import { TextCell } from './Text'
import { UpdatedAtCell } from './UpdatedAt'

const cellsMap: Record<FieldType, any> = {
  [FieldType.Text]: TextCell,
  [FieldType.Number]: NumberCell,
  [FieldType.Password]: PasswordCell,
  [FieldType.SingleSelect]: SingleSelectCell,
  [FieldType.MultipleSelect]: MultipleSelect,
  [FieldType.CreatedAt]: CreatedAtCell,
  [FieldType.UpdatedAt]: UpdatedAtCell,
}

interface Props {
  index: number
  columns: IColumnNode[]
  cell: ICellNode
}

export const TableCell = memo(
  function TableCell({ columns, cell, index }: Props) {
    const className = css({
      inlineFlex: true,
      bgWhite: true,
      borderBottom: true,
      borderRight: true,
    })

    const column = columns.find((c) => c.id === cell.props.columnId)!
    const { rowId, columnId } = cell.props
    const fieldType = column.props.fieldType

    const CellComponent = cellsMap[fieldType as FieldType]

    // TODO: get width from store, see ColumnItem
    const width = columnWidthMotion[column.id]

    async function updateCell(data: any) {
      await db.updateNode(cell.id, {
        props: { ...cell.props, data },
      })
    }

    return (
      <motion.div className={className} tabIndex={0} style={{ width }}>
        <CellComponent
          width={width}
          cell={cell}
          updateCell={updateCell}
          index={index}
        />
      </motion.div>
    )
  },
  (prev, next) => {
    return isEqual(prev, next)
  },
)
