import { atom, createStore } from 'jotai'
import { SyncStatus } from '@penx/constants'
import { emitter } from '@penx/event'
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

export const store = createStore()

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
  {
    id: 'add-document',
    title: 'Add document',
    handler: () => {
      emitter.emit('ADD_DOCUMENT')
    },
  },
])

export const pluginStoreAtom = atom<PluginStore>({})

////
// store.sub(spacesAtom, () => {
//   console.log('spacesAtom:', spacesAtom.toString())
//   console.log('change.... space:', store.get(spacesAtom))
// })
