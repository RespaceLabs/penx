import { routerAtom } from '@/lib/store'
import { useAtomValue } from 'jotai'

export function useRouterName() {
  const { name } = useAtomValue(routerAtom)
  return name
}
