import { Node } from '@/lib/model'
import { useNodes } from '@/lib/node-hooks'
import { NodeService } from '@/lib/service'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Props {
  node: Node
}
export function NodeList({ node }: Props) {
  const { nodes } = useNodes()
  const nodeService = new NodeService(node, nodes)

  return (
    <div className="mx-auto md:max-w-xl space-y-4 pt-16">
      <div className="text-2xl font-bold">All notes</div>
      <div className="flex flex-col gap-2">
        {nodeService.childrenNodes.map((node) => (
          <div key={node.id} className="font-semibold flex justify-between">
            <Link
              href={`/~/objects/${node.id}`}
              className="text-foreground/80 hover:block cursor-pointer hover:scale-105 transition-all"
            >
              {node.title || 'Untitled'}
            </Link>
            <div className="text-sm text-foreground/60">
              {node.updatedAtFormatted}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
