import { atom, createStore } from 'jotai'
import { SyncStatus } from '@penx/constants'
import { IDoc, ISpace } from '@penx/local-db'

export type Command = {
  id: string
  name: string
  handler: () => void
}

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
})
