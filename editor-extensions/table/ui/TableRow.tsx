import { mergeRefs } from 'react-merge-refs'
import { findNodePath } from '@/lib/editor-queries'
import { ElementProps } from '@/lib/extension-typings'
import { cn } from '@/lib/utils'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { Node } from 'slate'
import { useSlateStatic } from 'slate-react'
import { useStore } from 'stook'
import { rowSortableKey } from '../rowSortable.store'
import { TableRowElement } from '../types'

function always() {
  return true
}

export const TableRow = (props: ElementProps<TableRowElement>) => {
  const id = props.element.id!
  const editor = useSlateStatic()

  const rowSortable = useSortable({
    id,
    animateLayoutChanges: always,
  })

  const {
    attributes,
    listeners,
    index,
    isDragging,
    isSorting,
    active,
    over,
    setNodeRef,
    transform,
    transition,
  } = rowSortable

  useStore(rowSortableKey + id, rowSortable)

  const path = findNodePath(editor, props.element)!

  function getActiveStyle() {
    if (!over || !active) return {}
    if (props.element.id !== over.id) return {}
    if (over.id === active.id) return {}
    const { children } = Node.parent(editor, path) as any
    const activeIndex = children.findIndex((n: any) => n.id === active.id)
    const overIndex = children.findIndex((n: any) => n.id === over.id)
    const isAfter = overIndex > activeIndex
    const style = {
      left: 0,
      right: 0,
      top0: !isAfter,
      bottom0: isAfter,
      content: '""',
      position: 'absolute',
      h: 2,
      w: '100%',
      bgBlue500: true,
    }
    return {
      '::after': style,
    }
  }

  const style = {
    // transform: CSS.Transform.toString(transform),
    transform: isSorting ? undefined : CSS.Translate.toString(transform),
    transition,
  }
  const activeStyle = getActiveStyle()

  return (
    <tr
      style={style}
      {...props.attributes}
      {...attributes}
      ref={mergeRefs([props.attributes.ref, setNodeRef])}
      // css={activeStyle}
      className={cn(
        'tableRow outline-none bg-background relative',
        isDragging && 'bg-foreground/5',
        isDragging ? 'z-0' : 'z-1',
      )}
    >
      {props.children}
    </tr>
  )
}
