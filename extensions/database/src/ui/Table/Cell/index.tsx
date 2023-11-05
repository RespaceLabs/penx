import React, { memo } from 'react'
import isEqual from 'react-fast-compare'
import { css } from '@fower/react'
import { motion } from 'framer-motion'
import { db } from '@penx/local-db'
import { FieldType, ICellNode, IColumnNode } from '@penx/types'
import { CreatedAtCell } from './CreatedAt'
import { TextCell } from './Text'
import { UpdatedAtCell } from './UpdatedAt'

const cellsMap: Record<FieldType, any> = {
  Text: TextCell,
  Number: TextCell,
  SingleSelect: TextCell,
  CreatedAt: CreatedAtCell,
  UpdatedAt: UpdatedAtCell,
}

interface Props {
  index: number
  columns: IColumnNode[]
  cell: ICellNode
}

// eslint-disable-next-line react/display-name
export const TableCell = memo(
  ({ columns, cell, index }: Props) => {
    const className = css({
      inlineFlex: true,
      bgWhite: true,
      borderBottom: true,
      borderRight: true,
    })

    const column = columns.find((c) => c.id === cell.props.columnId)!
    const { width = 120 } = column.props
    const { fieldType, rowId, columnId } = cell.props
    const CellComponent = cellsMap[fieldType as FieldType]

    async function updateCell(data: any) {
      await db.updateNode(cell.id, {
        props: {
          ...cell.props,
          data,
        },
      })
    }

    return (
      <motion.div className={className} tabIndex={0} style={{ width }}>
        <CellComponent width={width} cell={cell} updateCell={updateCell} />
      </motion.div>
    )
  },
  (prev, next) => {
    return isEqual(
      {
        cell: prev.cell,
      },
      {
        cell: next.cell,
      },
    )
  },
)
