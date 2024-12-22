import React, { PropsWithChildren } from 'react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { MenuItem } from '@/components/ui/menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ViewType } from '@/lib/types'
import { PopoverClose } from '@radix-ui/react-popover'
import { useDatabaseContext } from '../DatabaseProvider'
import { ViewIcon } from './ViewIcon'

interface ItemProps extends PropsWithChildren {
  viewType: ViewType
}

function Item({ children, viewType, ...rest }: ItemProps) {
  const ctx = useDatabaseContext()
  async function addView() {
    toast.info('Coming soon!')
    // const view = await ctx.addView(viewType)
    // ctx.setActiveViewId(view.id)
  }

  return (
    <PopoverClose asChild>
      <MenuItem {...rest} onClick={addView}>
        {children}
      </MenuItem>
    </PopoverClose>
  )
}

function Content() {
  return (
    <div className="p-2">
      <Item viewType={ViewType.TABLE}>
        <ViewIcon viewType={ViewType.TABLE} />
        <div>Table</div>
      </Item>
      {/* 
      <Item viewType={ViewType.LIST}>
        <ViewIcon viewType={ViewType.LIST} />
        <div>List</div>
      </Item> */}

      <Item viewType={ViewType.GALLERY}>
        <ViewIcon viewType={ViewType.GALLERY} />
        <div>Gallery</div>
      </Item>

      {/* <Item viewType={ViewType.KANBAN}>
        <ViewIcon viewType={ViewType.KANBAN} />
        <Box>Kanban</Box>
      </Item> */}
    </div>
  )
}

export const AddViewBtn = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" size="icon" className="w-7 h-7">
          <Plus size={18} className="text-foreground/60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-40">
        <Content />
      </PopoverContent>
    </Popover>
  )
}
