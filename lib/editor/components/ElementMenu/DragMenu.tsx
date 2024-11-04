import { FC } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Copy, Hash, Plus, Trash2 } from 'lucide-react'
import { Path, Transforms } from 'slate'
import { useSlateStatic } from 'slate-react'

interface Props {
  id: string
  type: any
  path: Path
  listeners: any
}

export const DragMenu: FC<Props> = ({ id = '', path, listeners }) => {
  const editor = useSlateStatic()

  return (
    <Popover>
      <PopoverTrigger>
        <div
          className="flex items-center justify-center rounded transition-all hover:bg-foreground/5 py-[2px] opacity-0"
          // opacity-100--$editorElement--hover
          {...listeners}
        >
          {/* <IconDrag size={18} gray400></IconDrag> */}
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <div>
          <Copy size={18} />
          <div>Duplicate</div>
        </div>
        <div>
          <Hash size={18} />
          <div>Copy link</div>
        </div>
        <div
          onClick={() => {
            Transforms.removeNodes(editor, { at: path })
          }}
        >
          <Trash2 size={18} />
          <div>Delete</div>
        </div>
        <div>
          <Plus size={18} />
          <div>Add to below</div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
