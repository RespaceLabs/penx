import { Node } from '@/lib/model'
import { useNodes } from '@/lib/node-hooks'
import { NodeService } from '@/lib/service'
import { store } from '@/store'
import { NodeItem } from './NodeItem'

interface Props {}

export function NoteList({}: Props) {
  const { nodes } = useNodes()
  if (!nodes.length) return null
  const rootNode = store.node.getRootNode()
  const node = new Node(rootNode)
  const nodeService = new NodeService(node, nodes)

  return (
    <div className="flex flex-col gap-[1px] mt-2">
      {nodeService.childrenNodes.reverse().map((node) => {
        return <NodeItem key={node.id} node={node} />
      })}
    </div>
  )
}
