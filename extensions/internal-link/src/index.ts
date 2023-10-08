import { ExtensionContext } from '@penx/extension-typings'
import {
  ELEMENT_INTERNAL_LINK_CONTENT,
  ELEMENT_INTERNAL_LINK_SELECTOR,
} from './types'
import { InternalLinkContent } from './ui/InternalLinkContent'
import { InternalLinkSelector } from './ui/InternalLinkSelector'
import { withInternalLink } from './withInternalLink'

export function activate(ctx: ExtensionContext) {
  ctx.registerBlock({
    with: withInternalLink,
    elements: [
      {
        isInline: true,
        type: ELEMENT_INTERNAL_LINK_SELECTOR,
        component: InternalLinkSelector,
        slashCommand: {
          name: 'Internal Link',
        },
      },
      {
        isInline: true,
        isVoid: true,
        type: ELEMENT_INTERNAL_LINK_CONTENT,
        component: InternalLinkContent,
      },
    ],
  })
}

export * from './isInternalLinkSelectorElement'
