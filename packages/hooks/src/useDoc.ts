import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAtom, useSetAtom } from 'jotai'
import { Doc, DocService } from '@penx/domain'
import { db } from '@penx/local-db'
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
