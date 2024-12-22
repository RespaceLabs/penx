'use client'

import { Switch } from '@/components/ui/switch'
import { Group } from '@/lib/types'
import { useDatabaseContext } from '../../DatabaseProvider'

interface Props {
  group: Group
}

export const GroupItem = ({ group }: Props) => {
  const { currentView, deleteGroup } = useDatabaseContext()
  const columns: any[] = []

  async function removeGroup(columnId: string) {
    deleteGroup(currentView.id, columnId)
  }

  async function toggleSort(isAscending: boolean) {
    console.log('========isAscending:', isAscending)
  }

  const column = columns.find((col) => col.id === group.fieldId)!

  return (
    <div className="flex justify-between" key={group.fieldId}>
      <div className="flex items-center gap-1">
        <div className="text-sm text-foreground/40">Group by</div>
        <div className="text-sm">{column?.props.displayName}</div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center text-sm text-foreground/40 gap-1">
          <Switch
            checked={group.isAscending}
            onChange={(e) => {
              // toggleSort(e.target.checked)
            }}
          >
            Ascending
          </Switch>
        </div>
        {/* <CloseButton size={20} onClick={() => removeGroup(group.columnId)} /> */}
      </div>
    </div>
  )
}
