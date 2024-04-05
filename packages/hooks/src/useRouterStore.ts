import { useAtomValue } from 'jotai'
import { routerAtom, store } from '@penx/store'

export function useRouterStore() {
  useAtomValue(routerAtom)
  return store.router
}
