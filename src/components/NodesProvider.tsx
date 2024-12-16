'use client'

import { PropsWithChildren, useEffect } from 'react'
import { db } from '@/lib/local-db'
import { INode } from '@/lib/model'
import { useNodes } from '@/lib/node-hooks'
import { api } from '@/lib/trpc'
import { store } from '@/store'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import LoadingDots from './icons/loading-dots'

export const NodesProvider = ({ children }: PropsWithChildren) => {
  const { data: session } = useSession()

  const { data = [], isLoading } = useQuery({
    queryKey: ['nodes'],
    queryFn: async () => {
      const t0 = Date.now()
      let nodes = await db.listNodesByUserId(session?.userId!)
      if (!nodes?.length) {
        const remoteNodes = await api.node.myNodes.query()
        if (remoteNodes.length) {
          await db.deleteNodeByUserId()
          for (const node of remoteNodes) {
            await db.createNode(node as INode)
          }
        } else {
          await db.initNodes(session?.userId!)
        }
      }
      const userId = session?.userId!
      nodes = await db.listNodesByUserId(userId)

      const t1 = Date.now()

      console.log('>>>>>node init time', t1 - t0)

      return nodes
    },
    enabled: !!session?.userId,
  })

  const { nodes } = useNodes()

  useEffect(() => {
    if (data.length) {
      store.node.setNodes(data)
    }
  }, [data])

  if (isLoading || !data || !nodes?.length)
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingDots />
      </div>
    )

  return <>{children}</>
}
