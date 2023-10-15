import { useAtom, useSetAtom } from 'jotai'
import { Doc } from '@penx/model'
import { DocService } from '@penx/service'
import { docAtom } from '@penx/store'

export function useDoc() {
  const [docRaw] = useAtom(docAtom)
  const doc = new Doc(docRaw)
  const docService = new DocService(doc)

  return {
    doc,
    docService,
  }
}
