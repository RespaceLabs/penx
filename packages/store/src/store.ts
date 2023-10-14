import { atom, createStore } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { SyncStatus } from '@penx/constants'
import { emitter } from '@penx/event'
import {
  RegisterBlockOptions,
  RegisterComponentOptions,
  SettingsSchema,
} from '@penx/extension-typings'
import { db, DocStatus, IDoc, ISpace } from '@penx/local-db'

type pluginId = string

type RouteName = 'DOC' | 'TRASH' | 'ALL_DOCS'

export type RouterStore = {
  name: RouteName
  params: Record<string, any>
}

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

export const routerAtom = atomWithStorage('Router', {
  name: 'DOC',
} as RouterStore)

export const extensionStoreAtom = atom<ExtensionStore>({})

export const store = Object.assign(createStore(), {
  getSpaces() {
    return store.get(spacesAtom)
  },

  getActiveSpace() {
    const spaces = store.getSpaces()
    return spaces.find((space) => space.isActive)!
  },

  setSpaces(spaces: ISpace[]) {
    return store.set(spacesAtom, spaces)
  },

  getDoc() {
    return store.get(docAtom)
  },

  setDoc(doc: IDoc) {
    return store.set(docAtom, doc)
  },

  setDocs(docs: IDoc[]) {
    return store.set(docsAtom, docs)
  },

  routeTo(name: RouteName, params: Record<string, any> = {}) {
    return store.set(routerAtom, {
      name,
      params,
    })
  },

  // TODO: need improvement
  reloadDoc(doc: IDoc) {
    this.setDoc(null as any)

    // for rerender editor
    setTimeout(() => {
      this.setDoc(doc)
    }, 0)
  },

  async trashDoc(id: string) {
    const space = this.getActiveSpace()
    await db.trashDoc(id)

    const docs = await db.listDocsBySpaceId(space.id)
    const normalDocs = docs.filter((doc) => doc.status === DocStatus.NORMAL)

    if (normalDocs.length) {
      this.reloadDoc(normalDocs[0])
    } else {
      this.routeTo('ALL_DOCS')
    }
    this.setDocs(docs)
  },

  async restoreDoc(id: string) {
    const space = this.getActiveSpace()
    await db.restoreDoc(id)
    const docs = await db.listDocsBySpaceId(space.id)
    const normalDocs = docs.filter((doc) => doc.status === DocStatus.NORMAL)
    this.setDoc(normalDocs[0])
    this.setDocs(docs)
  },

  async createDoc() {
    const space = this.getActiveSpace()
    const doc = await db.createDoc({ spaceId: space.id })
    await db.updateSpace(space.id, { activeDocId: doc.id })

    const docs = await db.listDocsBySpaceId(space.id)

    this.routeTo('DOC')
    this.reloadDoc(doc)
    this.setDocs(docs)
  },
})

////
// store.sub(spacesAtom, () => {
//   console.log('spacesAtom:', spacesAtom.toString())
//   console.log('change.... space:', store.get(spacesAtom))
// })
