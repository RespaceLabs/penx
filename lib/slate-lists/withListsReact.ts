/* eslint-disable no-param-reassign */

import type { Editor } from 'slate'
import type { ReactEditor } from 'slate-react'
import { withRangeCloneContentsPatched } from './util'

/**
 * Enables Range.prototype.cloneContents monkey patch to improve pasting behavior
 * in few edge cases.
 */
export function withListsReact<T extends Editor & ReactEditor>(editor: T): T {
  const { setFragmentData } = editor

  editor.setFragmentData = (data: DataTransfer) => {
    withRangeCloneContentsPatched(function () {
      setFragmentData(data)
    })
  }

  return editor
}
