'use client'

import { LayoutList } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Group } from '@/lib/types'
import { useDatabaseContext } from '../../DatabaseProvider'
import { ToolbarBtn } from '../ToolbarBtn'
import { AddGroupBtn } from './AddGroupBtn'
import { GroupItem } from './GroupItem'

export const GroupField = () => {
  const { currentView } = useDatabaseContext()

  if (!currentView) return null

  const groups = currentView.groups as Group[]

  return (
    <Popover>
      <PopoverTrigger>
        <ToolbarBtn
          isHighlight={!!groups.length}
          icon={<LayoutList size={16} />}
        >
          <div className="flex items-center gap-1">
            {!!groups.length && <div> {groups.length} grouped fields</div>}
            {!groups.length && <div>Group</div>}
          </div>
        </ToolbarBtn>
      </PopoverTrigger>
      <PopoverContent w-300>
        {!groups.length && (
          <div className="p-3 text-foreground/40 text-sm">
            No groups applied to this view
          </div>
        )}

        {!!groups.length && (
          <div className="flex flex-col p-3 gap-1">
            {groups.map((item) => (
              <GroupItem key={item.fieldId} group={item} />
            ))}
          </div>
        )}

        <Separator />
        <div className="flex items-center justify-between p-3">
          <div className="text-foreground/40 text-sm">Coming soon</div>
          <AddGroupBtn />
        </div>
      </PopoverContent>
    </Popover>
  )
}
