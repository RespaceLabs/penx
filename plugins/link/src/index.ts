import { PluginContext } from '@penx/plugin-typings'
import { ElementType } from '../custom-types'
import { Link } from './Link'
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
