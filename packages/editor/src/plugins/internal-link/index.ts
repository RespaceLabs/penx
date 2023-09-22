import { ElementType } from '@penx/editor-shared'
import { EditorPlugin } from '@penx/editor-types'
import { InternalLinkContent } from './InternalLinkContent'
import { InternalLinkSelector } from './InternalLinkSelector'
import { withInternalLink } from './withInternalLink'

export default function internalLink(): EditorPlugin {
  return {
    with: withInternalLink,
    elements: [
      {
        isInline: true,
        type: ElementType.internal_link_selector,
        component: InternalLinkSelector,
      },
      {
        isInline: true,
        isVoid: true,
        type: ElementType.internal_link_content,
        component: InternalLinkContent,
      },
    ],
  }
}
