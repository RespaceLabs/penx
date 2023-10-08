import { Editor } from 'slate'
import { getAbove, isCollapsed } from '@penx/editor-queries'
import { unwrapNodes } from '@penx/editor-transforms'
import { ELEMENT_LINK, GetLinkUrl } from '../types'
import { upsertLinkAtSelection } from './upsertLinkAtSelection'

export const getAndUpsertLink = async (
  editor: Editor,
  getLinkUrl?: GetLinkUrl,
) => {
  const type = ELEMENT_LINK
  let prevUrl = ''

  const linkNode = getAbove(editor, {
    match: { type },
  })
  if (linkNode) {
    prevUrl = linkNode[0].url as string
  }

  let url
  if (getLinkUrl) {
    url = await getLinkUrl(prevUrl)
  } else {
    url = window.prompt(`Enter the URL of the link:`, prevUrl)
  }

  if (!url) {
    linkNode &&
      editor.selection &&
      unwrapNodes(editor, {
        at: editor.selection,
        match: { type: ELEMENT_LINK } as any,
      })

    return
  }

  // If our cursor is in middle of a link, then we don't want to insert it inline
  const shouldWrap: boolean =
    linkNode !== undefined && isCollapsed(editor.selection)
  upsertLinkAtSelection(editor, { url, wrap: shouldWrap })
}
