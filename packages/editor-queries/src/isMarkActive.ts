import { Editor } from 'slate'
import { isDefined } from '@penx/editor-shared'
import { getMark } from './getMark'

/**
 * Is the mark defined in the selection.
 */
export const isMarkActive = (editor: Editor, type: string) => {
  return isDefined(getMark(editor, type))
}
