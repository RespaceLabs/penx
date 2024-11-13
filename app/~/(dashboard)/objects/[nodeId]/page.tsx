'use client'

import { NodeEditorApp } from '@/components/EditorApp/NodeEditorApp'
import { ELECTRIC_BASE_URL } from '@/lib/constants'
import { db } from '@/lib/local-db'
import { Node } from '@/lib/model'
import { store } from '@/store'
import { Shape, ShapeStream } from '@electric-sql/client'
import { useLiveQuery } from '@electric-sql/pglite-react'
import { useShape } from '@electric-sql/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

export const dynamic = 'force-static'

// const stream = new ShapeStream({
//   url: `${ELECTRIC_BASE_URL}/v1/shape/site`,
// })

// stream.subscribe((messages) => {
//   console.log('=======messages:', messages)
//   //
// })

// const shape = new Shape(stream)

// shape.subscribe((data) => {
//   console.log('rows=data========:', data)
//   // rows is an array of the latest value of each row in a shape.
// })

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
