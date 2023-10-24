import { useAtomValue } from 'jotai'
import { Node } from '@penx/model'
import { NodeService, PageService } from '@penx/service'
import { pageAtom } from '@penx/store'

export function usePage() {
  const page = useAtomValue(pageAtom)

  const pageService = new PageService(page)

  const nodeService = new NodeService(new Node(page?.node))

  return {
    page,
    pageService,
    nodeService,
  }
}
