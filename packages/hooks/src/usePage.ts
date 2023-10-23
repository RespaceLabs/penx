import { useAtomValue } from 'jotai'
import { PageService } from '@penx/service'
import { pageAtom } from '@penx/store'

export function usePage() {
  const page = useAtomValue(pageAtom)
  const pageService = new PageService(page)
  return {
    page,
    pageService,
  }
}
