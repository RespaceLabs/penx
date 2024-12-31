'use client'

import {
  withTriggerCombobox,
  type TriggerComboboxPluginOptions,
} from '@udecode/plate-combobox'
import {
  createSlatePlugin,
  insertNodes,
  type PluginConfig,
} from '@udecode/plate-common'
import type { TTagElement } from './types'

export type TagConfig = PluginConfig<
  'tag',
  {
    insertSpaceAfterMention?: boolean
  } & TriggerComboboxPluginOptions,
  {},
  {
    insert: {
      tag: (options: { search: string; value: any; key?: any }) => void
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
    tag: ({ key, value }) => {
      insertNodes<TTagElement>(editor, {
        key,
        children: [{ text: '' }],
        type,
        value,
      })
    },
  },
}))
