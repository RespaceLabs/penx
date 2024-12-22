import { ViewField } from '@/lib/types'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Item } from './Item'

interface Props {
  id: string
  index: number
  viewField: ViewField
}

export function SortableItem(props: Props) {
  const { id, index, viewField } = props
  const {
    attributes,
    listeners,
    isDragging,
    isSorting,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <Item
      ref={setNodeRef}
      id={id}
      index={index}
      isDragging={isDragging}
      isSorting={isSorting}
      viewField={viewField}
      style={style}
      attributes={attributes}
      listeners={listeners}
    ></Item>
  )
}
