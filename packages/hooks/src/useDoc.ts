import { useEffect } from 'react'
import { useAtom } from 'jotai'
import { DocService } from '@penx/domain'
import { db } from '@penx/local-db'
import { docAtom } from '@penx/store'

export function useInitDoc(docId: string) {
  const [_, setDoc] = useAtom(docAtom)

  useEffect(() => {
    db.getDoc(docId).then((doc) => {
      if (doc) setDoc(doc)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

export function useDoc() {
  const [docValue] = useAtom(docAtom)
  const doc = new DocService(docValue)

  return doc
}
