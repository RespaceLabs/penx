import { atom, createStore } from 'jotai'
import { SyncStatus } from '@penx/constants'
import { IDoc, ISpace } from '@penx/local-db'

export type Command = {
  id: string
  title: string
  pluginId?: string
  handler: () => void
}
export type PluginStore = Record<
  string,
  {
    components: Array<{
      at: string
      component: any
    }>
  }
>

export const docAtom = atom(null as any as IDoc)

export const spacesAtom = atom<ISpace[]>([])

export const syncStatusAtom = atom<SyncStatus>(SyncStatus.NORMAL)

export const commandsAtom = atom<Command[]>([
  {
    id: 'foo',
    title: 'foo',
    handler: () => {
      console.log('fooo')
    },
  },
  {
    id: 'bar',
    title: 'bar',
    handler: () => {
      console.log('bar')
    },
  },
])

export const pluginStoreAtom = atom<PluginStore>({})

export const store = Object.assign(createStore(), {
  setSpaces: (state: ISpace[]) => {
    store.set(spacesAtom, state)
  },

  setDoc: (state: IDoc) => {
    store.set(docAtom, state)
  },

  setSyncStatus: (state: SyncStatus) => {
    store.set(syncStatusAtom, state)
  },

  setCommands: (state: Command[]) => {
    store.set(commandsAtom, state)
  },

  setPluginStore: (state: PluginStore) => {
    store.set(pluginStoreAtom, state)
  },
})
