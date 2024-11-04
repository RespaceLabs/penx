import { Node } from '@/lib/model'
import { BaseEditor, Element } from 'slate'
import { HistoryEditor } from 'slate-history'
import { ReactEditor, useSlate, useSlateStatic } from 'slate-react'

export type TElement<T = string> = Element & { type: T; nodeType?: string }

export type PenxEditor = BaseEditor &
  ReactEditor &
  HistoryEditor & {
    elementMaps: any
    onKeyDownFns: any
    onBlurFns: any
    onSelectFns: any
    onClickBullet: any

    isOutliner: boolean

    isBlockSelectorOpened: boolean
    isTagSelectorOpened: boolean
    isBidirectionalLinkSelector: boolean

    copiedNodeId: string

    isInTodoPage: boolean

    isOnComposition: boolean

    isReadonly: boolean

    nodeToDecorations: Map<any, Range[]>

    spaceId: string

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
