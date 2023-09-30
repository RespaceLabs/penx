import { PluginContext } from '@penx/plugin-typings'
import { ElementType } from '../custom-types'
import { InternalLinkContent } from './InternalLinkContent'
import { InternalLinkSelector } from './InternalLinkSelector'
import { withInternalLink } from './withInternalLink'

export function activate(ctx: PluginContext) {
  ctx.registerBlock({
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
  })
}
