'use client'

import { PropsWithChildren, useEffect } from 'react'
import { extensionList } from '@/lib/extension-list'
import { extensionStore } from '@/lib/extension-store'
import { ExtensionContext } from '@/lib/extension-typings'
import { db } from '@/lib/local-db'
import { useNodes } from '@/lib/node-hooks'
import { commandsAtom, getLocalActiveNode, store } from '@/store'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import LoadingDots from './icons/loading-dots'

export const extensionContext: ExtensionContext = {
  pluginId: undefined,

  registerCommand(options) {
    const commands = store.get(commandsAtom)
    store.set(commandsAtom, [...commands, options])

    extensionStore.addCommand(options)
  },

  executeCommand(id) {
    //
  },

  defineSettings(schema) {
    extensionStore.addSetting(this.pluginId!, schema)
  },

  registerComponent({ at, component }) {
    extensionStore.addComponent(this.pluginId!, { at, component })
  },

  registerBlock(options) {
    extensionStore.addBlock(this.pluginId!, options)
  },
  notify() {
    //
  },
}

export const NodesProvider = ({ children }: PropsWithChildren) => {
  const { data: session } = useSession()

  const { data = [], isLoading } = useQuery({
    queryKey: ['nodes'],
    queryFn: async () => {
      const t0 = Date.now()
      let node = await db.getRootNode(session?.userId!)
      if (!node) {
        await db.initNodes(session?.userId!)
      }
      const userId = session?.userId!
      const nodes = await db.listNodesByUserId(userId)

      for (const item of extensionList) {
        const ctx = Object.create(extensionContext, {
          pluginId: {
            writable: false,
            configurable: false,
            value: item.id,
          },
        })
        item.activate(ctx)
      }

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
