import { createContext, useContext } from 'react'
import { Node } from '@penx/model'
import { NodeService } from '@penx/service'

export interface NodeContext {
  index: number
  node: Node
  nodeService: NodeService
}

export const nodeContext = createContext<NodeContext>({} as NodeContext)

export const NodeProvider = nodeContext.Provider

export function useNodeContext() {
  return useContext(nodeContext)
}
