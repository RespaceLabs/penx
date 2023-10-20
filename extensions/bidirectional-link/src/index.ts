import { ExtensionContext } from '@penx/extension-typings'
import {
  ELEMENT_BIDIRECTIONAL_LINK_CONTENT,
  ELEMENT_BIDIRECTIONAL_LINK_SELECTOR,
} from './types'
import { BidirectionalLinkContent } from './ui/BidirectionalLinkContent'
import { BidirectionalLinkSelector } from './ui/BidirectionalLinkSelector'
import { withBidirectionalLink } from './withBidirectionalLink'

export function activate(ctx: ExtensionContext) {
  ctx.registerBlock({
    with: withBidirectionalLink,
    elements: [
      {
        isInline: true,
        type: ELEMENT_BIDIRECTIONAL_LINK_SELECTOR,
        component: BidirectionalLinkSelector,
        slashCommand: {
          name: 'Internal Link',
        },
      },
      {
        isInline: true,
        isVoid: true,
        type: ELEMENT_BIDIRECTIONAL_LINK_CONTENT,
        component: BidirectionalLinkContent,
      },
    ],
  })
}

export * from './isBidirectionalLinkSelectorElement'
