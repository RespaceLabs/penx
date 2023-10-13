import { atom, createStore } from 'jotai'
import { SyncStatus } from '@penx/constants'
import { emitter } from '@penx/event'
import {
  RegisterBlockOptions,
  RegisterComponentOptions,
  SettingsSchema,
} from '@penx/extension-typings'
import { IDoc, ISpace } from '@penx/local-db'

type pluginId = string

export type Command = {
  id: string
  name: string
  pluginId?: string
  handler: () => void
}

export type ExtensionStore = Record<
  pluginId,
  {
    components: Array<RegisterComponentOptions>
    block: RegisterBlockOptions
    settingsSchema: SettingsSchema
  }
>

export const docAtom = atom(null as any as IDoc)

export const docsAtom = atom<IDoc[]>([])

export const spacesAtom = atom<ISpace[]>([])

export const syncStatusAtom = atom<SyncStatus>(SyncStatus.NORMAL)

export const commandsAtom = atom<Command[]>([
  {
    id: 'add-document',
    name: 'Add document',
    handler: () => {
      emitter.emit('ADD_DOCUMENT')
    },
  },

  {
    id: 'export-to-markdown',
    name: 'export to markdown',
    handler: () => {
      emitter.emit('ADD_DOCUMENT')
    },
  },
])

export const extensionStoreAtom = atom<ExtensionStore>({})

export const store = Object.assign(createStore(), {
  async createDoc() {
    //
  },
})

////
// store.sub(spacesAtom, () => {
//   console.log('spacesAtom:', spacesAtom.toString())
//   console.log('change.... space:', store.get(spacesAtom))
// })
