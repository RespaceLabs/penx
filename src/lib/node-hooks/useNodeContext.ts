import { createContext, useContext } from 'react'
import { Node } from '@/lib/model'

export interface NodeContext {
  node: Node
}

export const nodeContext = createContext<NodeContext>({} as NodeContext)

export const NodeProvider = nodeContext.Provider

export function useNodeContext() {
  return useContext(nodeContext)
}
