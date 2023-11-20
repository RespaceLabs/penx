import {
  ELEMENT_BIDIRECTIONAL_LINK_CONTENT,
  ELEMENT_BIDIRECTIONAL_LINK_SELECTOR,
} from '@penx/constants'
import { ExtensionContext } from '@penx/extension-typings'
import { onBlur } from './handlers/onBlur'
import { onKeyDown } from './handlers/onKeyDown'
import { BidirectionalLinkContent } from './ui/BidirectionalLinkContent'
import { BidirectionalLinkSelector } from './ui/BidirectionalLinkSelector'
import { withBidirectionalLink } from './withBidirectionalLink'

export function activate(ctx: ExtensionContext) {
  ctx.registerBlock({
    with: withBidirectionalLink,
    handlers: {
      onKeyDown: onKeyDown,
      onBlur: onBlur,
    },
    elements: [
      {
        isInline: true,
        type: ELEMENT_BIDIRECTIONAL_LINK_SELECTOR,
        component: BidirectionalLinkSelector,
        // slashCommand: {
        //   name: 'Bidirectional Link',
        // },
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

export * from './isBidirectionalLinkSelector'
