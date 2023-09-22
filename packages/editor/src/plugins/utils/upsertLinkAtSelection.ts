import { Editor, Transforms } from 'slate'
import { isCollapsed } from '@penx/editor-queries'
import { ElementType } from '@penx/editor-shared'
import { unwrapNodes } from '@penx/editor-transforms'
import { wrapLink } from '../link/transforms'

/**
 * Unwrap link at a location (default: selection).
 * Then, the focus of the location is set to selection focus.
 * Then, wrap the link at the location.
 */
export const upsertLinkAtSelection = (
  editor: Editor,
  {
    url,
    wrap,
  }: {
    url: string
    /**
     * If true, wrap the link at the location (default: selection) even if the selection is collapsed.
     */
    wrap?: boolean
  },
) => {
  if (!editor.selection) return

  const type = ElementType.link

  // if our cursor is inside an existing link, but don't have the text selected, select it now
  if (isCollapsed(editor.selection)) {
    const linkLeaf = Editor.leaf(editor, editor.selection)
    const [, inlinePath] = linkLeaf
    Transforms.select(editor, inlinePath)
  }

  unwrapNodes(editor, { at: editor.selection, match: { type } })

  wrapLink(editor as any, { at: editor.selection, url })

  Transforms.collapse(editor, { edge: 'end' })
}
