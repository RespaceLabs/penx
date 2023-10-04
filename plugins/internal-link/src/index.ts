import { PluginContext } from '@penx/plugin-typings'
import { ElementType } from './types'
import { InternalLinkContent } from './ui/InternalLinkContent'
import { InternalLinkSelector } from './ui/InternalLinkSelector'
import { withInternalLink } from './withInternalLink'

export function activate(ctx: PluginContext) {
  ctx.registerBlock({
    with: withInternalLink,
    elements: [
      {
        isInline: true,
        type: ElementType.internal_link_selector,
        component: InternalLinkSelector,
        slashCommand: {
          name: 'Internal Link',
        },
      },
      {
        isInline: true,
        isVoid: true,
        type: ElementType.internal_link_content,
        component: InternalLinkContent,
      },
    ],
  })
}

export * from './isInternalLinkSelectorElement'
