import { useAtomValue } from 'jotai'
import { routerAtom, store } from '@/store'

export function useRouterStore() {
  useAtomValue(routerAtom)
  return store.router
}
