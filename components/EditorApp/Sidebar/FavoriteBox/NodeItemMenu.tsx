import { FC, PropsWithChildren } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Node } from '@/lib/model'
import { PopoverClose } from '@radix-ui/react-popover'
import { MoreHorizontal, Trash } from 'lucide-react'

interface Props {
  node: Node
}

export const NodeItemMenu: FC<PropsWithChildren<Props>> = ({ node }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          className="inline-flex hover:bg-foreground/10 rounded cursor-pointer text-foreground/70 p1 opacity-0"
          // opacity-100--$nodeItem--hover
        >
          <MoreHorizontal size={18} />
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverClose asChild>
          <div onClick={async () => {}}>
            <Trash size={18} />
            <div>Delete</div>
          </div>
        </PopoverClose>
      </PopoverContent>
    </Popover>
  )
}
