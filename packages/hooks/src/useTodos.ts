import { useAtomValue } from 'jotai'
import { nodesAtom, store } from '@penx/store'

export function useTodos() {
  useAtomValue(nodesAtom)
  const todos = store.node.getTodos()

  return {
    todos,
  }
}
