import { atom, createStore } from 'jotai'
import { SyncStatus } from '@penx/constants'
import { User } from '@penx/model'
import { commands } from './constants'
import { EditorStore } from './stores/EditorStore'
import { NodeStore } from './stores/NodeStore'
import { RouterStore } from './stores/RouterStore'
import { SpaceStore } from './stores/SpaceStore'
import { Command, ExtensionStore } from './types'

export const appLoadingAtom = atom(true)

export const syncStatusAtom = atom<SyncStatus>(SyncStatus.NORMAL)

export const commandsAtom = atom<Command[]>(commands)

export const extensionStoreAtom = atom<ExtensionStore>({})

export const userAtom = atom<User>({} as User)

const baseStore = createStore()

export const store = Object.assign(baseStore, {
  get: baseStore.get,
  set: baseStore.set,

  get router() {
    return new RouterStore(this)
  },

  get editor() {
    return new EditorStore(this)
  },

  get space() {
    return new SpaceStore(this)
  },

  get node() {
    return new NodeStore(this)
  },

  getAppLoading() {
    return store.get(appLoadingAtom)
  },

  setAppLoading(loading: boolean) {
    return store.set(appLoadingAtom, loading)
  },

  getUser() {
    return store.get(userAtom)
  },

  setUser(user: User) {
    return store.set(userAtom, user)
  },
})
