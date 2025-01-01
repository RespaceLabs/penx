'use client'

import { api } from '@/lib/trpc'
import {
  withTriggerCombobox,
  type TriggerComboboxPluginOptions,
} from '@udecode/plate-combobox'
import {
  createSlatePlugin,
  insertNodes,
  setNodes,
  type PluginConfig,
} from '@udecode/plate-common'
import { findNodePath } from '@udecode/plate-common/react'
import { Editor, Transforms } from 'slate'
import type { TTagElement } from './types'

export type TagConfig = PluginConfig<
  'tag',
  {
    insertSpaceAfterMention?: boolean
  } & TriggerComboboxPluginOptions,
  {},
  {
    insert: {
      tag: (options: {
        search: string
        value: any
        key?: any
        color: string
        databaseId: string
        element: any
      }) => void
    }
  }
>

export const BaseTagInputPlugin = createSlatePlugin({
  key: 'tag_input',
  node: { isElement: true, isInline: true, isVoid: true },
})

/** Enables support for autocompleting @mentions. */
export const BaseTagPlugin = createSlatePlugin({
  key: 'tag',
  extendEditor: withTriggerCombobox,
  node: { isElement: true, isInline: true, isMarkableVoid: true, isVoid: true },
  options: {
    createComboboxInput: (trigger) => ({
      children: [{ text: '' }],
      trigger,
      type: BaseTagInputPlugin.key,
    }),
    trigger: '#',
    triggerPreviousCharPattern: /^\s?$/,
  },
  plugins: [BaseTagInputPlugin],
}).extendEditorTransforms<TagConfig['transforms']>(({ editor, type }) => ({
  insert: {
    tag: async ({ key, value, color, databaseId, element }) => {
      insertNodes<TTagElement>(editor, {
        key,
        children: [{ text: '' }],
        type,
        value,
        color,
        databaseId,
      })
      const block = Editor.above(editor as any, {
        match: (n) => Editor.isBlock(editor as any, n as any),
      })

      const path = findNodePath(editor, element)
      // console.log('=======block:', block, 'element:', element, 'path:', path)

      const { id } = await api.database.addRefBlockRecord.mutate({
        databaseId,
        refBlockId: (block?.[0] as any)?.id,
      })

      setNodes<TTagElement>(editor, { recordId: id }, { at: path })
    },
  },
}))
