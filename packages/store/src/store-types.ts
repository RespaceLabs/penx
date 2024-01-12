import { Atom, WritableAtom } from 'jotai'
import type { AppStore } from './stores/AppStore'
import { CatalogueStore } from './stores/CatalogueStore'
import type { EditorStore } from './stores/EditorStore'
import type { NodeStore } from './stores/NodeStore'
import type { RouterStore } from './stores/RouterStore'
import type { SpaceStore } from './stores/SpaceStore'
import type { SyncStore } from './stores/SyncStore'

export type StoreType = {
  get: <Value>(atom: Atom<Value>) => Value
  set: <Value_1, Args extends unknown[], Result>(
    atom: WritableAtom<Value_1, Args, Result>,
    ...args: Args
  ) => Result

  router: RouterStore
  space: SpaceStore
  node: NodeStore
  catalogue: CatalogueStore
  editor: EditorStore
  app: AppStore
  sync: SyncStore
}
