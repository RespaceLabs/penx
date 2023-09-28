import { atom, createStore } from 'jotai'
import { SyncStatus } from '@penx/constants'
import { emitter } from '@penx/event'
// import { emitter } from '@'
import { IDoc, ISpace } from '@penx/local-db'
import {
  RegisterBlockOptions,
  RegisterComponentOptions,
} from '@penx/plugin-typings'

type pluginId = string

export type Command = {
  id: string
  title: string
  pluginId?: string
  handler: () => void
}

export type PluginStore = Record<
  pluginId,
  {
    components: Array<RegisterComponentOptions>
    block: RegisterBlockOptions
  }
>

export const store = createStore()

export const docAtom = atom(null as any as IDoc)

export const spacesAtom = atom<ISpace[]>([])

export const syncStatusAtom = atom<SyncStatus>(SyncStatus.NORMAL)

export const commandsAtom = atom<Command[]>([
  {
    id: 'add-document',
    title: 'Add document',
    handler: () => {
      emitter.emit('ADD_DOCUMENT')
    },
  },

  {
    id: 'export-to-markdown',
    title: 'export to markdown',
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
