import { BaseEditor, Element } from 'slate'
import { HistoryEditor } from 'slate-history'
import { ReactEditor, useSlate, useSlateStatic } from 'slate-react'
import { Node } from '@penx/model'

export type TElement<T = string> = Element & { type: T; nodeType?: string }

export type PenxEditor = BaseEditor &
  ReactEditor &
  HistoryEditor & {
    elementMaps: any
    onKeyDownFns: any
    onBlurFns: any
    onClickBullet: any

    isBlockSelectorOpened: boolean
    isTagSelectorOpened: boolean
    isBidirectionalLinkSelector: boolean

    isOnComposition: boolean

    nodeToDecorations: Map<any, Range[]>

    // save all items to editor
    items: Node[]

    // save flattened node to editor
    flattenedItems: any[]
  }

export function useEditor() {
  return useSlate() as PenxEditor
}

export function useEditorStatic() {
  return useSlateStatic() as PenxEditor
}
