import React, { FC, memo } from 'react'
import { useDatabaseContext } from '@/lib/database-context'
import { format } from 'date-fns'
import { CellProps } from './CellProps'

export const UpdatedAtCell: FC<CellProps> = memo(function UpdatedAtCell(props) {
  const { cell } = props
  const { rows } = useDatabaseContext()
  const row = rows.find((r) => r.id === cell.props.rowId)!

  return (
    <div className="w-full flex items-center px-2 text-sm border border-foreground/10 rounded-xl h-10">
      {format(new Date(row.updatedAt), 'yyyy-MM-dd HH:mm:ss')}
    </div>
  )
})
