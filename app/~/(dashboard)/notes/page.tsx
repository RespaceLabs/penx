'use client'

import { EditorApp } from '@/components/EditorApp/EditorApp'
import { NodeList } from '@/components/EditorApp/NodeList/NodeList'
import { ELECTRIC_BASE_URL } from '@/lib/constants'
import { db } from '@/lib/local-db'
import { Node } from '@/lib/model'
import { useNodes } from '@/lib/node-hooks'
import { Shape, ShapeStream } from '@electric-sql/client'
import { useLiveQuery } from '@electric-sql/pglite-react'
import { useShape } from '@electric-sql/react'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useParams, usePathname, useRouter } from 'next/navigation'

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
  const { data: session } = useSession()
  const { data, isLoading } = useQuery({
    queryKey: ['root-node'],
    queryFn: async () => {
      return db.getRootNode(session!.userId)
    },
    enabled: !!session?.userId,
  })

  if (isLoading) return null
  const node = new Node(data!)
  return <NodeList node={node} />
}
