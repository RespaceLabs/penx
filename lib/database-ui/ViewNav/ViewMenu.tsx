import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useDatabaseContext } from '@/lib/database-context'
import { IViewNode } from '@/lib/model'
import { Copy, MoreVertical, Trash2 } from 'lucide-react'

interface ViewMenuProps {
  index: number
  view: IViewNode
}

export const ViewMenu = ({ view, index }: ViewMenuProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost">
          <MoreVertical />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Content view={view} index={index} />
      </PopoverContent>
    </Popover>
  )
}

function Content({ view, index }: ViewMenuProps) {
  const { database, updateView, deleteView, views, setActiveViewId } =
    useDatabaseContext()
  const [name, setName] = useState(view.props.name)

  return (
    <>
      <div className="p-2">
        <Input
          size="sm"
          value={name}
          onBlur={() => {
            updateView(view.id, { name })
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              updateView(view.id, { name })
              // close()
            }
          }}
          onChange={(e) => {
            setName(e.target.value)
          }}
        />
      </div>

      <div
        onClick={() => {
          // toast.info('Coming soon..')
          close()
        }}
      >
        <div>
          <Copy size={16} />
        </div>
        <div>Duplicate View</div>
      </div>

      <div
        // disabled={index === 0}
        onClick={async () => {
          if (index === 0) return
          await deleteView(view.id)
          setActiveViewId(database.props.viewIds[0])
          close()
        }}
      >
        <div>
          <Trash2 size={16} />
        </div>
        <div>Delete View</div>
      </div>
    </>
  )
}
