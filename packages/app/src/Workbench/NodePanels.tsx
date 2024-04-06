import { Box } from '@fower/react'
import { useActiveNodes } from '@penx/hooks'
import { Node } from '@penx/model'
import { NodeProvider } from '@penx/node-hooks'
import { DatabaseApp } from '@penx/widget'
import { MobileNav } from './NodeNav/MobileNav'
import { PCNav } from './NodeNav/PCNav'
import { PanelItem } from './PanelItem'

export function NodePanels() {
  const { activeNodes } = useActiveNodes()

  return (
    <Box flex-1>
      {activeNodes.map((item, index) => {
        const node = new Node(item)
        return (
          <Box key={node.id} w-100p>
            <NodeProvider value={{ node, index }}>
              <PCNav />
              <MobileNav />
              {node.isDatabase ? (
                <DatabaseApp node={node} />
              ) : (
                <PanelItem key={index} node={node} index={index} />
              )}
            </NodeProvider>
          </Box>
        )
      })}
    </Box>
  )
}
