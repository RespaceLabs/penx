import { useEffect } from 'react'
import { Box } from '@fower/react'
import { useActiveNodes } from '@penx/hooks'
import { db } from '@penx/local-db'
import { Node } from '@penx/model'
import { NodeType } from '@penx/model-types'
import { store } from '@penx/store'
import { PanelItem } from './PanelItem'

export function NodePanels() {
  const { activeNodes } = useActiveNodes()

  return (
    <Box flex-1 toLeft>
      {activeNodes.map((node, index) => (
        <PanelItem key={index} node={new Node(node)} index={index} />
      ))}
    </Box>
  )
}
