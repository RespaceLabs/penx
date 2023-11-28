import { atom } from 'jotai'
import { PenxEditor } from '@penx/editor-common'
import { StoreType } from './store-types'

export const editorsAtom = atom<Map<number, PenxEditor>>(new Map())

export class EditorStore {
  constructor(private store: StoreType) {}

  getEditor(index: number) {
    const editors = this.store.get(editorsAtom)
    return editors.get(index)!
  }

  getMainEditor() {
    const editors = this.store.get(editorsAtom)
    return editors.get(0)!
  }

  setEditor(index: number, editor: PenxEditor) {
    const editors = this.store.get(editorsAtom)
    editors.set(index, editor)
    this.store.set(editorsAtom, editors)
    ;(window as any).__editor = editors.get(0)
  }
}
