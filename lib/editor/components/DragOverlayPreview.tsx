import { Node, WithFlattenedProps } from '@/lib/model'

interface Props {
  item: WithFlattenedProps<Node>
}

export function DragOverlayPreview({ item }: Props) {
  return (
    <div className="h-8 flex items-center rounded opacity-80">
      {item.title || 'Untitled'}
    </div>
  )
}
