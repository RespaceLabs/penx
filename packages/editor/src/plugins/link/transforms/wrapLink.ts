import { Editor, Location } from 'slate'
import { ElementType } from '@penx/editor-shared'
import { wrapNodes } from '@penx/editor-transforms'

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
      type: ElementType.link,
      url,
      children: [],
    },
    { at, split: true },
  )
}
