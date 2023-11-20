import { useAtomValue } from 'jotai'
import { activeNodesAtom } from '@penx/store'

export function useActiveNodes() {
  const activeNodes = useAtomValue(activeNodesAtom)
  return {
    activeNodes,
  }
}
