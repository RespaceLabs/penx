'use client'

import { NodeEditorApp } from '@/components/EditorApp/NodeEditorApp'
import { ELECTRIC_BASE_URL } from '@/lib/constants'
import { db } from '@/lib/local-db'
import { Node } from '@/lib/model'
import { store } from '@/store'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

export const dynamic = 'force-static'

export default function Page() {
  const params = useParams()

  const { data, isLoading } = useQuery({
    queryKey: ['note', params?.nodeId],
    queryFn: async () => {
      if (params.nodeId === 'today') {
        return store.node.selectDailyNote(new Date(), false)
      }
      // return store.node.getNode(params.nodeId as string)
      return db.getNode(params.nodeId as string)
    },
    enabled: !!params?.nodeId,
  })

  if (isLoading) return null

  const node = new Node(data!)
  return <NodeEditorApp node={node}></NodeEditorApp>
}
