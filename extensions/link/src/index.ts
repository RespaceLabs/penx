import { ExtensionContext } from '@penx/extension-typings'
import { Link } from './Link'
import { ELEMENT_LINK } from './types'
import { withLink } from './withLink'

export function activate(ctx: ExtensionContext) {
  ctx.registerBlock({
    with: withLink,
    elements: [
      {
        isInline: true,
        type: ELEMENT_LINK,
        component: Link,
        // slashCommand: {
        //   name: 'Link',
        // },
      },
    ],
  })
}

export * from './isLinkElement'
