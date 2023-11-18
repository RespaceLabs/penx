import type { KeyboardEvent } from 'react'
import { Editor } from 'slate'
import { ListsEditor } from './ListsEditor'
import * as OnKeyDownHandlers from './on-key-down'

export function onKeyDown(
  editor: Editor,
  event: KeyboardEvent,
): boolean | void {
  if (!ListsEditor.isListsEnabled(editor)) {
    return
  }

  try {
    return (
      onKeyDown.onTabIncreaseListDepth(editor, event) ||
      onKeyDown.onShiftTabDecreaseListDepth(editor, event) ||
      onKeyDown.onBackspaceDecreaseListDepth(editor, event) ||
      onKeyDown.onEnterEscapeFromEmptyList(editor, event) ||
      onKeyDown.onEnterSplitNonEmptyList(editor, event)
    )
  } catch (e) {
    console.log('onkeydown', e)
  } finally {
    // Slate does not always trigger normalization when one would expect it to.
    // So we want to force it after we perform lists operations, as it fixes
    // many unexpected behaviors.
    // https://github.com/ianstormtaylor/slate/issues/3758
    Editor.normalize(editor, { force: true })
  }
}

export namespace onKeyDown {
  export const onTabIncreaseListDepth = OnKeyDownHandlers.onTabIncreaseListDepth
  export const onShiftTabDecreaseListDepth =
    OnKeyDownHandlers.onShiftTabDecreaseListDepth
  export const onBackspaceDecreaseListDepth =
    OnKeyDownHandlers.onBackspaceDecreaseListDepth
  export const onEnterEscapeFromEmptyList =
    OnKeyDownHandlers.onEnterEscapeFromEmptyList
  export const onEnterSplitNonEmptyList =
    OnKeyDownHandlers.onEnterSplitNonEmptyList
}
