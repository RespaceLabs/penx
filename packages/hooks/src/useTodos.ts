import { useAtomValue } from 'jotai'
import { nodesAtom, store } from '@penx/store'

export function useTodos() {
  const nodes = useAtomValue(nodesAtom)
  const todos = store.node.getTodos()

  return {
    todos,
  }
}
