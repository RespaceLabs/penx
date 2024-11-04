import { useEditor } from '@/lib/editor-common'
import { findNodePath } from '@/lib/editor-queries'
import { ElementProps } from '@/lib/extension-typings'
import { cn } from '@/lib/utils'
import { useCollapsed } from '../hooks/useCollapsed'
import { ListElement } from '../types'

export const List = ({
  attributes,
  children,
  element,
  nodeProps,
}: ElementProps<ListElement>) => {
  const editor = useEditor()
  const collapsed = useCollapsed(element)

  const path = findNodePath(editor, element)!
  const isRootList = path.length === 1

  return (
    <div
      data-type="list"
      {...attributes}
      {...nodeProps}
      className={cn(
        'mx-0 pl-8',
        isRootList && !editor.isOutliner && '-ml-2',
        nodeProps?.className,
      )}
    >
      <div className={cn(collapsed && 'hidden')}>{children}</div>
    </div>
  )
}
