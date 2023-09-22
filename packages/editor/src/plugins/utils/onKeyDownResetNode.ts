import isHotkey from 'is-hotkey'
import { Editor, Element } from 'slate'
import { isCollapsed, someNode } from '@penx/editor-queries'
import { setNodes } from '@penx/editor-transforms'

export const SIMULATE_BACKSPACE: any = {
  key: '',
  which: 8,
}

export const onKeyDownResetNode =
  (editor: Editor, { options: { rules } }: any) =>
  (event: Event) => {
    let reset: boolean = false

    if (editor.selection && isCollapsed(editor.selection)) {
      rules!.forEach(
        ({ types, defaultType, hotkey, predicate, onReset }: any) => {
          if (hotkey && isHotkey(hotkey, event as any)) {
            if (
              predicate(editor) &&
              someNode(editor, { match: { type: types } })
            ) {
              event.preventDefault?.()

              setNodes<Element>(editor, { type: defaultType })

              onReset?.(editor)

              reset = true
            }
          }
        },
      )
    }

    return reset
  }
