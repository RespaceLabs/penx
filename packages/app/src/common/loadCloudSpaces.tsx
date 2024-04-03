import { db } from '@penx/local-db'
import { getMnemonicFromLocal } from '@penx/mnemonic'
import { ISpace } from '@penx/model-types'
import { getLocalSession } from '@penx/storage'
import { store } from '@penx/store'
import { SyncServerClient } from '@penx/sync-server-client'
import { api } from '@penx/trpc-client'

export const loadCloudSpaces = async () => {
  const session = await getLocalSession()
  const cloudSpaces = await api.space.mySpaces.query()
  const localSpaces = store.space.getSpaces()
  const ids = localSpaces.map((i) => i.id)
  const mnemonic = await getMnemonicFromLocal(session?.secret!)

  for (const space of cloudSpaces) {
    if (ids.includes(space.id)) continue
    const newSpace = await db.createSpace(space as any as ISpace, false)
    const client = new SyncServerClient(newSpace, mnemonic)
    const allNodes = await client.getAllNodes()

    for (const node of allNodes) {
      await db.createNode(node)
    }
  }

  const newSpaces = await db.listSpaces()
  store.space.setSpaces(newSpaces)
}
