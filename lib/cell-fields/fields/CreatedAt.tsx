import React, { FC, memo } from 'react'
import { useDatabaseContext } from '@/lib/database-context'

import { format } from 'date-fns'
import { CellProps } from './CellProps'

export const CreatedAtCell: FC<CellProps> = memo(function CreatedAtCell(props) {
  const { cell } = props
  const { rows } = useDatabaseContext()
  const row = rows.find((r) => r.id === cell.props.rowId)!

  return (
    <div className="w-full flex items-center px-2 text-sm h-10 rounded-xl border border-foreground/15">
      {format(new Date(row.createdAt), 'yyyy-MM-dd HH:mm:ss')}
    </div>
  )
})
