import { useAtomValue } from 'jotai'
import { routerAtom, store } from '@/lib/store'

export function useRouterStore() {
  useAtomValue(routerAtom)
  return store.router
}
