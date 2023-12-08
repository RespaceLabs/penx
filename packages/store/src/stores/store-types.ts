import { Atom, WritableAtom } from 'jotai'
import type { AppStore } from './AppStore'
import type { EditorStore } from './EditorStore'
import type { NodeStore } from './NodeStore'
import type { RouterStore } from './RouterStore'
import type { SpaceStore } from './SpaceStore'

export type StoreType = {
  get: <Value>(atom: Atom<Value>) => Value
  set: <Value_1, Args extends unknown[], Result>(
    atom: WritableAtom<Value_1, Args, Result>,
    ...args: Args
  ) => Result

  router: RouterStore
  space: SpaceStore
  node: NodeStore
  editor: EditorStore
  app: AppStore
}
