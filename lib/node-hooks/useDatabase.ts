import { useAtomValue, useSetAtom } from 'jotai'
import { nodesAtom, store } from '@/store'

export function useDatabase(id: string) {
  useAtomValue(nodesAtom)
  return {
    ...store.node.getDatabase(id),
  }
}
