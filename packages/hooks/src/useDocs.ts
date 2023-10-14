import { useEffect, useMemo } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { CatalogueTree } from '@penx/catalogue'
import { Doc, DocListService } from '@penx/domain'
import { db, DocStatus } from '@penx/local-db'
import { docsAtom, store } from '@penx/store'

export function useQueryDocs(spaceId: string) {
  const setDocs = useSetAtom(docsAtom)

  useEffect(() => {
    db.listDocsBySpaceId(spaceId).then((docs) => {
      setDocs(docs)

      if (!store.getDoc()) {
        const normalDocs = docs.filter((doc) => doc.status === DocStatus.NORMAL)

        if (normalDocs.length) {
          const space = store.getSpaces().find((s) => s.id === spaceId)
          const activeDoc = normalDocs.find(
            (doc) => doc.id === space?.activeDocId,
          )
          store.setDoc(activeDoc || docs[0])
        }
      }
    })
  }, [setDocs, spaceId])
}

export function useDocs() {
  const docs = useAtomValue(docsAtom)
  const catalogueTree = useMemo(() => {
    return CatalogueTree.fromJSON(docs)
  }, [docs])

  const docList = useMemo(() => {
    return new DocListService(docs)
  }, [docs])

  return {
    docList,
    docs: docs.map((doc) => new Doc(doc)),
    catalogueTree,
  }
}
