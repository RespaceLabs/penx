import { useAtomValue, useSetAtom } from 'jotai'
import { nodesAtom, store } from '@/store'

export function useDatabaseNodes() {
  useAtomValue(nodesAtom)
  return store.node.getDatabaseNodes()
}
