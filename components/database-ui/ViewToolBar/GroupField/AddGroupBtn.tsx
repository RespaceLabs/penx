'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { IColumnNode } from '@/lib/model'
import { Group } from '@/lib/types'
import { Menu, MenuItem } from '@ariakit/react'
import { useDatabaseContext } from '../../DatabaseProvider'
import { FieldIcon } from '../../shared/FieldIcon'

export const AddGroupBtn = () => {
  const { currentView, addGroup } = useDatabaseContext()
  const columns: any[] = []

  let { viewFields = [] } = currentView

  const sortedColumns = viewFields.map(
    (o) => columns.find((c) => c.id === o.fieldId)!,
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
        <Menu>
          {sortedColumns
            .filter((i) => {
              const groups = currentView.groups as Group[]
              const find = groups.find((item) => item.fieldId === i.id)
              return !find
            })
            .map((column) => {
              return (
                <MenuItem
                  key={column.id}
                  onClick={() => {
                    // close()
                    selectColumn(column)
                  }}
                >
                  <FieldIcon size={18} fieldType={column.props.fieldType} />
                  <div>{column.props.displayName}</div>
                </MenuItem>
              )
            })}
        </Menu>
      </PopoverContent>
    </Popover>
  )
}
