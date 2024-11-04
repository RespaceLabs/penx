import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useDatabaseContext } from '@/lib/database-context'
import { IColumnNode } from '@/lib/model'

import { Plus } from 'lucide-react'
import { FieldIcon } from '../../shared/FieldIcon'

export const AddGroupBtn = () => {
  const { currentView, columns, addGroup } = useDatabaseContext()

  let { viewColumns = [] } = currentView.props

  // TODO: fallback to old data
  if (!viewColumns.length) {
    viewColumns = (currentView.props as any)?.columns.map((i: any) => ({
      columnId: i.id,
      ...i,
    }))
  }

  const sortedColumns = viewColumns.map(
    (o) => columns.find((c) => c.id === o.columnId)!,
  )

  async function selectColumn(column: IColumnNode) {
    await addGroup(currentView.id, column.id, {
      isAscending: true,
    })
  }

  return (
    <Popover>
      <PopoverTrigger>
        <Button size="sm">
          <Plus size={16} />
          <div>Add group</div>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div>
          {sortedColumns
            .filter((i) => {
              const { groups = [] } = currentView.props
              const find = groups.find((item) => item.columnId === i.id)
              return !find
            })
            .map((column) => {
              return (
                <div
                  key={column.id}
                  onClick={() => {
                    close()
                    selectColumn(column)
                  }}
                >
                  <FieldIcon size={18} fieldType={column.props.fieldType} />
                  <div>{column.props.displayName}</div>
                </div>
              )
            })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
