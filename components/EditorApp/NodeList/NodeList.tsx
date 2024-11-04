import { Node } from '@/lib/model'
import { useNodes } from '@/lib/node-hooks'
import { NodeService } from '@/lib/service'
import { store } from '@/store'

interface Props {
  node: Node
}
export function NodeList({ node }: Props) {
  const { nodes } = useNodes()
  const nodeService = new NodeService(node, nodes)

  return (
    <div className="mx-auto md:max-w-xl pt-20 space-y-4">
      <div className="text-2xl font-bold">All pages</div>
      <div className="flex flex-col gap-2">
        {nodeService.childrenNodes.map((node) => (
          <div key={node.id} className="font-semibold flex justify-between">
            <div
              className="text-foreground/80 hover:block cursor-pointer hover:scale-105 transition-all"
              onClick={() => {
                store.node.selectNode(node.raw)
              }}
            >
              {node.title || 'Untitled'}
            </div>
            <div className="text-sm text-foreground/60">
              {node.updatedAtFormatted}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
