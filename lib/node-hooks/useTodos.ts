import { useAtomValue } from 'jotai'
import { nodesAtom, store } from '@/store'

export function useTodos() {
  useAtomValue(nodesAtom)
  const todos = store.node.getTodos()

  return {
    todos,
  }
}
