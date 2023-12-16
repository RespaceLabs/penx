import React, { FC, memo } from 'react'
import { Box } from '@fower/react'
import { format } from 'date-fns'
import { useDatabaseContext } from '../../DatabaseContext'
import { CellProps } from './CellProps'

export const CreatedAtCell: FC<CellProps> = memo(function CreatedAtCell(props) {
  const { cell } = props
  const { rows } = useDatabaseContext()
  const row = rows.find((r) => r.id === cell.props.rowId)!

  return (
    <Box w-100p toCenterY px2 textSM>
      {format(new Date(row.createdAt), 'yyyy-MM-dd HH:mm:ss')}
    </Box>
  )
})
