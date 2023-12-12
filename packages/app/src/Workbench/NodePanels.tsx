import { Box } from '@fower/react'
import { useActiveNodes } from '@penx/hooks'
import { Node } from '@penx/model'
import { PanelItem } from './PanelItem'

export function NodePanels() {
  const { activeNodes } = useActiveNodes()

  // console.log('=============activeNodes:', activeNodes)

  return (
    <Box flex-1 toLeft>
      {activeNodes.map((node, index) => (
        <PanelItem key={index} node={new Node(node)} index={index} />
      ))}
    </Box>
  )
}
