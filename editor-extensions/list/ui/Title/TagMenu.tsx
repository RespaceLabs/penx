import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { db, getColorNames } from '@/lib/local-db'
import { cn } from '@/lib/utils'
import { store } from '@/store'

import { TitleElement } from '../../types'

interface Props {
  element: TitleElement
}

function ColorSelector({ element }: Props) {
  const colorNames = getColorNames()

  async function selectColor(color: string) {
    const node = await db.getNode(element.id!)
    const newNode = await db.updateNode(element.id!, {
      props: {
        ...node.props,
        color: color,
      },
    })

    // close()
    // const nodes = await db.listNodesByUserId(node.spaceId)
    // store.node.setNodes(nodes)
    // store.node.selectNode(newNode)
  }

  return (
    <div className="flex items-center flex-wrap gap-2 p-4 justify-between">
      {colorNames.map((color) => (
        <div
          key={color}
          title={color}
          // bg={color}
          // bg--T20--hover={color}
          className={cn(
            'h-6 w-6 rounded-full cursor-pointer hover:scale-110 transition-all',
          )}
          onClick={() => selectColor(color)}
        />
      ))}
    </div>
  )
}

export const TagMenu = ({ element }: Props) => {
  return (
    <div
      className="absolute flex items-center left-3 top-[2px]"
      style={{ height: '1.5em' }}
    >
      <Popover>
        <PopoverTrigger asChild>
          <div
            contentEditable={false}
            className={cn(
              'cursor-pointer h-4 w-4 text-white rounded-full flex items-center justify-between',
              element.props?.color || 'text-foreground',
            )}
          >
            #
          </div>
        </PopoverTrigger>
        <PopoverContent>
          <ColorSelector element={element} />

          <div>Delete (coming)</div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
