import { useEffect, useMemo } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { CatalogueTree } from '@penx/catalogue'
import { db } from '@penx/local-db'
import { docsAtom } from '@penx/store'

export function useQueryDocs(spaceId: string) {
  const setDocs = useSetAtom(docsAtom)

  useEffect(() => {
    db.listDocsBySpaceId(spaceId).then((docs) => {
      setDocs(docs)
    })
  }, [setDocs, spaceId])
}

export function useDocs() {
  const docs = useAtomValue(docsAtom)
  const catalogueTree = useMemo(() => {
    return CatalogueTree.fromJSON(docs)
  }, [docs])
  return { docs, catalogueTree }
}
