import { Editor, Element, Transforms } from 'slate'
import { isCollapsed } from '@penx/editor-queries'
import { insertNodes, unwrapNodes } from '@penx/editor-transforms'
import { ELEMENT_LINK, LinkElement } from '../types'
import { wrapLink } from './wrapLink'

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

  const type = ELEMENT_LINK

  if (!wrap && isCollapsed(editor.selection)) {
    return insertNodes<LinkElement>(editor, {
      type,
      url,
      children: [{ text: url }],
    })
  }

  // if our cursor is inside an existing link, but don't have the text selected, select it now
  if (wrap && isCollapsed(editor.selection)) {
    const linkLeaf = Editor.leaf(editor, editor.selection)
    const [, inlinePath] = linkLeaf
    Transforms.select(editor, inlinePath)
  }

  unwrapNodes(editor, { at: editor.selection, match: { type } as any })

  wrapLink(editor, { at: editor.selection, url })

  Transforms.collapse(editor, { edge: 'end' })
}
