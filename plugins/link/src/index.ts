import { PluginContext } from '@penx/plugin-typings'
import { Link } from './Link'
import { ElementType } from './types'
import { withLink } from './withLink'

export function activate(ctx: PluginContext) {
  ctx.registerBlock({
    with: withLink,
    elements: [
      {
        isInline: true,
        type: ElementType.link,
        component: Link,
        slashCommand: {
          name: 'Link',
        },
      },
    ],
  })
}

export * from './isLinkElement'
