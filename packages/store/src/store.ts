import { atom, createStore } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { SyncStatus } from '@penx/constants'
import { emitter } from '@penx/event'
import { db } from '@penx/local-db'
import type { User } from '@penx/model'
import {
  Command,
  DocStatus,
  ExtensionStore,
  IDoc,
  ISpace,
  RouteName,
  RouterStore,
} from '@penx/types'

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

export const userAtom = atom<User>(null as any as User)

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

  getUser() {
    return store.get(userAtom)
  },

  setDoc(doc: IDoc) {
    return store.set(docAtom, doc)
  },

  setDocs(docs: IDoc[]) {
    return store.set(docsAtom, docs)
  },

  setUser(user: User) {
    return store.set(userAtom, user)
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

  async deleteDoc(id: string) {
    const space = this.getActiveSpace()
    await db.deleteDoc(id)
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
