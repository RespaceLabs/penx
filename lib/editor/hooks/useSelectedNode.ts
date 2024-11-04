import { Node } from 'slate'
import { mutate, useStore } from 'stook'

const key = 'EDITOR_SELECT_NODE'

export function useSelectedNode() {
  const [node] = useStore<Node>(key)
  return { node }
}

export function setSelectedNode(node: any) {
  mutate(key, node)
}
