import { set } from 'idb-keyval'
import { atom, createStore } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { commands } from './constants'
import { AppStore } from './stores/AppStore'
import { CatalogueStore } from './stores/CatalogueStore'
import { EditorStore } from './stores/EditorStore'
import { NodeStore } from './stores/NodeStore'
import { RouterStore } from './stores/RouterStore'
import { SpaceStore } from './stores/SpaceStore'
import { SyncStore } from './stores/SyncStore'
import { UserStore } from './stores/UserStore'
import { Command, ExtensionStore } from './types'

export const commandsAtom = atom<Command[]>(commands)

export const extensionStoreAtom = atom<ExtensionStore>({})

const PENX_TOKEN = 'PENX_TOKEN'
export const tokenAtom = atomWithStorage(PENX_TOKEN, '')

const baseStore = createStore()

export const store = Object.assign(baseStore, {
  get: baseStore.get,
  set: baseStore.set,

  get app() {
    return new AppStore(this)
  },

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

  get catalogue() {
    return new CatalogueStore(this)
  },

  get sync() {
    return new SyncStore(this)
  },

  get user() {
    return new UserStore(this)
  },

  getToken() {
    return store.get(tokenAtom)
  },

  setToken(token: string) {
    set(PENX_TOKEN, token)
    return store.set(tokenAtom, token)
  },
})
