import { Editor, Location } from 'slate'
import { wrapNodes } from '@penx/editor-transforms'
import { ELEMENT_LINK } from '../types'

/**
 * Wrap selected nodes with a link and collapse at the end.
 */
export const wrapLink = <T = {}>(
  editor: Editor,
  { at, url }: { url: string; at?: Location },
) => {
  wrapNodes(
    editor,
    {
      type: ELEMENT_LINK,
      url,
      children: [],
    },
    { at, split: true },
  )
}
