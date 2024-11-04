import React, { PropsWithChildren } from 'react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useDatabaseContext } from '@/lib/database-context'
import { ViewType } from '@/lib/model'
import { Plus } from 'lucide-react'
import { ViewIcon } from './ViewIcon'

interface ItemProps {
  viewType: ViewType
}

function Item({ children, viewType, ...rest }: PropsWithChildren<ItemProps>) {
  const ctx = useDatabaseContext()
  async function addColumn() {
    const view = await ctx.addView(viewType)
    ctx.setActiveViewId(view.id)
    // close()
  }

  return (
    <div
      className="flex items-center text-sm text-foreground/80 gap-2 cursor-pointer rounded px-2 py-2"
      {...rest}
      onClick={addColumn}
    >
      {children}
    </div>
  )
}

function Content() {
  return (
    <div className="w-[200px] gap-2">
      <Item viewType={ViewType.TABLE}>
        <ViewIcon viewType={ViewType.TABLE} />
        <div>Table</div>
      </Item>

      <Item viewType={ViewType.LIST}>
        <ViewIcon viewType={ViewType.LIST} />
        <div>List</div>
      </Item>

      <Item viewType={ViewType.GALLERY}>
        <ViewIcon viewType={ViewType.GALLERY} />
        <div>Gallery</div>
      </Item>

      <Item viewType={ViewType.KANBAN}>
        <ViewIcon viewType={ViewType.KANBAN} />
        <div>Kanban</div>
      </Item>
    </div>
  )
}

export const AddViewBtn = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost">
          <Plus size={20} />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Content />
      </PopoverContent>
    </Popover>
  )
}
