import { Switch } from '@/components/ui/switch'
import { useDatabaseContext } from '@/lib/database-context'
import { Sort } from '@/lib/model'

interface Props {
  sort: Sort
}
export const SortItem = ({ sort }: Props) => {
  const { currentView, columns, deleteSort } = useDatabaseContext()

  async function removeSort(columnId: string) {
    deleteSort(currentView.id, columnId)
  }

  async function toggleSort(isAscending: boolean) {
    console.log('========isAscending:', isAscending)
  }

  const column = columns.find((col) => col.id === sort.columnId)!

  return (
    <div key={sort.columnId} className="flex justify-between">
      <div className="flex items-center gap-1">
        <div className="text-xs text-foreground/40">Sort by</div>
        <div className="text-sm">{column?.props.displayName}</div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center text-xs text-foreground/40 gap-1">
          <Switch
            checked={sort.isAscending}
            // onChange={(e) => toggleSort(e.target.checked)}
          >
            Ascending
          </Switch>
        </div>
        {/* <CloseButton size={20} onClick={() => removeSort(sort.columnId)} /> */}
      </div>
    </div>
  )
}
