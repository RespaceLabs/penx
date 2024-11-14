import { Node } from '@/lib/model'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Props {
  node: Node
}

export function NodeItem({ node }: Props) {
  const params = useParams()
  const { title = '' } = node
  return (
    <Link
      key={node.id}
      href={`/~/objects/${node.id}`}
      className={cn(
        'flex items-center justify-between gap-2 rounded px-2 text-foreground/70 hover:bg-foreground/5 py-1 transition-all cursor-pointer w-full text-sm',
        params.nodeId === node.id && 'bg-foreground/5',
      )}
    >
      {title.length > 40 ? title?.slice(0, 40) + '...' : title || 'Untitled'}
    </Link>
  )
}
