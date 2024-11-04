import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useBulletDrawer } from '@/hooks'
import { Node } from '@/lib/model'
import { useDatabaseNodes } from '@/lib/node-hooks'

export const AddTag = () => {
  const { close, node } = useBulletDrawer()
  const nodes = useDatabaseNodes()

  return (
    <div className="-mx-2 pt-4 px-3">
      <div className="text-xs text-foreground/40 mb-2">
        <div className="flex items-center justify-center gap-1">
          <Input placeholder="Search or add a tag" className="flex-1" />
          <Button>Add</Button>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {nodes.map((item) => {
          const node = new Node(item)
          if (node.isTodoDatabase) return null
          return (
            <div
              key={item.id}
              className="flex items-center justify-center text-xs text-foreground/40 rounded-full py-2 px-3"
              // bg--T92={node?.tagColor}
              // bg--T88--hover={node?.tagColor}
              // color={node?.tagColor}
              // color--D4--hover={node?.tagColor}
              // onClick={() => onSelect(node)}
            >
              #{node.tagName}
            </div>
          )
        })}
      </div>
    </div>
  )
}
