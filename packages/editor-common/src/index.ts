import { BaseEditor } from 'slate'
import { HistoryEditor } from 'slate-history'
import { ReactEditor, useSlate, useSlateStatic } from 'slate-react'

export type PenxEditor = BaseEditor &
  ReactEditor &
  HistoryEditor & {
    elementMaps: any
    onKeyDownFns: any
    onBlurFns: any
    onClickBullet: any
    isBlockSelectorOpened: boolean
    nodeToDecorations: Map<Element, Range[]>
  }

export function useEditor() {
  return useSlate() as PenxEditor
}

export function useEditorStatic() {
  return useSlateStatic() as PenxEditor
}
