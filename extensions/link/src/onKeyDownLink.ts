import isHotkey from 'is-hotkey'
import { Editor } from 'slate'
import { getAndUpsertLink } from './transforms'

export const onKeyDownLink =
  (editor: Editor, { options: { getLinkUrl, hotkey } }: any) =>
  (e: Event) => {
    if (!hotkey) return

    if (isHotkey(hotkey, e as any)) {
      e.preventDefault()
      e.stopPropagation()

      getAndUpsertLink(editor, getLinkUrl)
    }
  }
