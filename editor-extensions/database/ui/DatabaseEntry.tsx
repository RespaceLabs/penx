import { ElementProps } from '@/lib/extension-typings'
import { db } from '@/lib/local-db'
import { cn } from '@/lib/utils'
import { store } from '@/store'
import { DatabaseEntryElement } from '../types'

export const DatabaseEntry = ({
  attributes,
  element,
  children,
}: ElementProps<DatabaseEntryElement>) => {
  async function selectDatabase() {
    const node = await db.getNode(element.databaseId)
    store.node.selectNode(node)
  }

  return (
    <div
      className="flex-1 leading-normal"
      contentEditable={false}
      {...attributes}
    >
      <div
        className={cn(
          'inline-flex px-2 py-[2px] my-1 rounded cursor-pointer text-sm transition-colors',
        )}
        // bg--T92={element.props.color}
        // bg--T88--hover={element.props.color}
        // color={element.props.color}
        // color--D4--hover={element.props.color}
        onClick={selectDatabase}
      >
        # {element.name}
      </div>
      {children}
    </div>
  )
}
