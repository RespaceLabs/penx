import { useAtomValue } from 'jotai'
import { pageAtom } from '@penx/store'

export function usePage() {
  const page = useAtomValue(pageAtom)

  return {
    page,
  }
}
