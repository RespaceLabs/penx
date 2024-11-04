import { Editor, Transforms } from 'slate'
import { getQueryOptions } from '@/lib/editor-queries'
import { WrapOptions } from '@/lib/editor-types'

/**
 * Unwrap nodes with extended options.
 * See {@link Transforms.unwrapNodes}
 */
export const unwrapNodes = (editor: Editor, options?: WrapOptions) => {
  Transforms.unwrapNodes(editor, getQueryOptions(editor, options))
}
