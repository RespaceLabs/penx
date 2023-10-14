import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAtom, useSetAtom } from 'jotai'
import { Doc, DocService } from '@penx/domain'
import { db } from '@penx/local-db'
import { docAtom } from '@penx/store'

export function useQueryDoc(docId: string) {
  const setDoc = useSetAtom(docAtom)
  const [inited, setInited] = useState(false)

  const { isLoading, data: doc } = useQuery(['doc'], () => db.getDoc(docId))
  useEffect(() => {
    if (!doc) return
    setDoc(doc)
    setInited(true)
  }, [doc, setDoc])
  return { isLoading, doc, inited }
}

export function useDoc() {
  const [docRaw] = useAtom(docAtom)
  const doc = new Doc(docRaw)
  const docService = new DocService(doc)

  return {
    doc,
    docService,
  }
}
