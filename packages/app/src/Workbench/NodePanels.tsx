import { Box } from '@fower/react'
import { FullPageDatabase } from '@penx/database-ui'
import { useActiveNodes } from '@penx/hooks'
import { Node } from '@penx/model'
import { NodeProvider } from '@penx/node-hooks'
import { BottomBar } from './BottomBar'
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
              <BottomBar />
              <PCNav />
              <MobileNav />
              {node.isDatabase ? (
                <FullPageDatabase node={node} />
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
