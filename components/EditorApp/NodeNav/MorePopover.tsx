import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { LogOut, MoreHorizontal, StarOff, Trash2 } from 'lucide-react'

export const MorePopover = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost">
          <MoreHorizontal />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        {/* <MenuItem gap2 onClick={async () => {}}>
          <StarOff size={18} />
          <div>Remove from Favorites</div>
        </MenuItem> */}

        <div
          onClick={async () => {
            //
          }}
        >
          <Trash2 size={18} />
          <div>Delete node</div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
