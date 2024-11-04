import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useDatabaseContext } from '@/lib/database-context'

import { SortAsc } from 'lucide-react'
import { ToolbarBtn } from '../ToolbarBtn'
import { AddSortBtn } from './AddSortBtn'
import { SortItem } from './SortItem'

export const SortField = () => {
  const { currentView } = useDatabaseContext()

  if (!currentView) return null

  const { sorts = [] } = currentView.props

  return (
    <Popover>
      <PopoverTrigger>
        <ToolbarBtn
          isHighlight={!!sorts.length}
          hightLightColor="red"
          icon={<SortAsc size={16} />}
        >
          <div className="flex items-center gap-1">
            {!!sorts.length && <div> {sorts.length} sorted fields</div>}
            {!sorts.length && <div>Sort</div>}
          </div>
        </ToolbarBtn>
      </PopoverTrigger>
      <PopoverContent>
        {!sorts.length && (
          <div className="p-3 text-foreground/40 text-sm">
            No sorts applied to this view
          </div>
        )}

        {!!sorts.length && (
          <div className="flex flex-col gap-1 p-3">
            {sorts.map((sort) => (
              <SortItem key={sort.columnId} sort={sort} />
            ))}
          </div>
        )}

        <div className="flex items-center justify-between p-3">
          <div className="text-foreground/40 text-sm">Coming soon</div>
          <AddSortBtn />
        </div>
      </PopoverContent>
    </Popover>
  )
}
