import { findNodePath } from '@/lib/editor-queries'
import { ElementProps } from '@/lib/extension-typings'
import { cn } from '@/lib/utils'
import { useSlateStatic } from 'slate-react'
import { ListItemElement } from '../types'
import { GuideLine } from './GuideLine'

export const ListItem = ({
  attributes,
  element,
  children,
  nodeProps,
}: ElementProps<ListItemElement>) => {
  const editor = useSlateStatic()
  const path = findNodePath(editor, element)!

  return (
    <div
      data-type="list-item"
      {...attributes}
      {...nodeProps}
      className={cn(
        'py-0 m-0 relative',
        nodeProps?.className,
        path.length > 2 && 'p-10',
      )}
    >
      {path.length > 2 && <GuideLine />}
      {children}
    </div>
  )
}
