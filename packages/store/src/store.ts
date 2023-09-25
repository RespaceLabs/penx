import { atom, createStore } from 'jotai'
import { SyncStatus } from '@penx/constants'
import { IDoc, ISpace } from '@penx/local-db'

export type Command = {
  id: string
  name: string
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

export const countAtom = atom(0)

export const docAtom = atom(null as any as IDoc)

export const spacesAtom = atom<ISpace[]>([])

export const syncStatusAtom = atom<SyncStatus>(SyncStatus.NORMAL)

export const commandsAtom = atom<Command[]>([
  {
    id: 'foo',
    name: 'foo',
    handler: () => {},
  },
])

export const pluginStoreAtom = atom<PluginStore>({})

export const store = Object.assign(createStore(), {
  setSpaces: (spaces: ISpace[]) => {
    store.set(spacesAtom, spaces)
  },

  setDoc: (doc: IDoc) => {
    store.set(docAtom, doc)
  },

  setSyncStatus: (status: SyncStatus) => {
    store.set(syncStatusAtom, status)
  },

  setCommands: (state: Command[]) => {
    store.set(commandsAtom, state)
  },

  setPluginStore: (state: PluginStore) => {
    store.set(pluginStoreAtom, state)
  },
})
