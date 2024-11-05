import { useActiveNode } from '@/hooks'
import { FullPageDatabase } from '@/lib/database-ui'
import { Node } from '@/lib/model'
import { NodeProvider } from '@/lib/node-hooks'
import { NodeList } from './NodeList/NodeList'
import { MobileNav } from './NodeNav/MobileNav'
import { PCNav } from './NodeNav/PCNav'
import { PanelItem } from './PanelItem'

export function NodePanels() {
  const { activeNode } = useActiveNode()

  if (!activeNode) return null

  const node = new Node(activeNode)

  if (node.isRootNode) {
    return <NodeList key={node.id} node={node} />
  }

  return (
    <div className="flex-1">
      <NodeProvider value={{ node }}>
        {/* <PCNav /> */}
        {/* <MobileNav /> */}
        {node.isDatabase ? (
          <FullPageDatabase node={node} />
        ) : (
          <PanelItem node={node} />
        )}
      </NodeProvider>
    </div>
  )
}
