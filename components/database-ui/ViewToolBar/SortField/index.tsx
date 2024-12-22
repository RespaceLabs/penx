'use client'

import { SortAsc } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Sort } from '@/lib/types'
import { useDatabaseContext } from '../../DatabaseProvider'
import { ToolbarBtn } from '../ToolbarBtn'
import { AddSortBtn } from './AddSortBtn'
import { SortItem } from './SortItem'

export const SortField = () => {
  const { currentView } = useDatabaseContext()

  if (!currentView) return null

  const sorts = currentView.sorts as Sort[]

  return (
    <Popover>
      <PopoverTrigger>
        <ToolbarBtn isHighlight={!!sorts.length} icon={<SortAsc size={16} />}>
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
          <div className="p-3 flex flex-col gap-1">
            {sorts.map((sort) => (
              <SortItem key={sort.fieldId} sort={sort} />
            ))}
          </div>
        )}

        <Separator />
        <div className="p-3 flex justify-between items-center">
          <div className="text-foreground/40 text-sm">Coming soon</div>
          <AddSortBtn />
        </div>
      </PopoverContent>
    </Popover>
  )
}
