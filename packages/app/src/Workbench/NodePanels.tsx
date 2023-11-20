import { Box } from '@fower/react'
import { useActiveNodes } from '@penx/hooks'
import { Node } from '@penx/model'
import { PanelItem } from './PanelItem'

export function NodePanels() {
  const { activeNodes } = useActiveNodes()

  console.log('activeNodes:', activeNodes)

  return (
    <Box flex-1 toLeft>
      {activeNodes.map((node, index) => (
        <Box key={node.id} flex-1 borderRight>
          <PanelItem node={new Node(node)} index={index} />
        </Box>
      ))}
    </Box>
  )
}
