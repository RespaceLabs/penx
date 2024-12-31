'use client'

import {
  getBlockAbove,
  getEditorPlugin,
  insertText,
  isEndPoint,
  moveSelection,
  type SlateEditor,
} from '@udecode/plate-common'
import { BaseTagPlugin, type TagConfig } from './BaseTagPlugin'
import type { TTagItemBase } from './types'

export type TagOnSelectItem<TItem extends TTagItemBase = TTagItemBase> = (
  editor: SlateEditor,
  item: TItem,
  search?: string,
) => void

export const getTagOnSelectItem =
  <TItem extends TTagItemBase = TTagItemBase>({
    key = BaseTagPlugin.key,
  }: { key?: string } = {}): TagOnSelectItem<TItem> =>
  (editor, item, search = '') => {
    const { getOptions, tf } = getEditorPlugin<TagConfig>(editor, {
      key: key as any,
    })
    const { insertSpaceAfterMention } = getOptions()

    tf.insert.tag({ key: item.key, search, value: item.text })

    // move the selection after the element
    moveSelection(editor, { unit: 'offset' })

    const pathAbove = getBlockAbove(editor)?.[1]

    const isBlockEnd =
      editor.selection &&
      pathAbove &&
      isEndPoint(editor, editor.selection.anchor, pathAbove)

    if (isBlockEnd && insertSpaceAfterMention) {
      insertText(editor, ' ')
    }
  }
