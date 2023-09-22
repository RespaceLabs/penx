import { Editor, Location } from 'slate'
import { getRangeBefore, getText } from '@penx/editor-queries'

export const isPreviousCharacterEmpty = (editor: Editor, at: Location) => {
  const range = getRangeBefore(editor, at)
  if (range) {
    const text = getText(editor, range)
    if (text) {
      const noWhiteSpaceRegex = new RegExp(`\\S+`)

      return !text.match(noWhiteSpaceRegex)
    }
  }

  return true
}
