import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { useDatabaseContext } from '@/lib/database-context'
import { Group } from '@/lib/model'


interface Props {
  group: Group
}

export const GroupItem = ({ group }: Props) => {
  const { currentView, columns, deleteGroup } = useDatabaseContext()

  async function removeGroup(columnId: string) {
    deleteGroup(currentView.id, columnId)
  }

  async function toggleSort(isAscending: boolean) {
    console.log('========isAscending:', isAscending)
  }

  const column = columns.find((col) => col.id === group.columnId)!

  return (
    <div key={group.columnId} className="flex justify-between">
      <div className="flex items-center gap-1">
        <div className="text-xs text-foreground/40">Group by</div>
        <div className="text-sm">{column?.props.displayName}</div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center text-xs text-foreground/40 gap-1">
          <Switch
            checked={group.isAscending}
            // onChange={(value) => toggleSort(value)}
          >
            Ascending
          </Switch>
        </div>
        <Button onClick={() => removeGroup(group.columnId)}>Delete</Button>
      </div>
    </div>
  )
}
