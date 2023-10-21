import { ExtensionContext } from '@penx/extension-typings'
import { ELEMENT_NODE } from './constants'
import { onKeyDown } from './handlers/onKeyDown'
import { isNode } from './isNode'
import { NodeComponent } from './ui/NodeComponent'
import { withNode } from './withNode'

export function activate(ctx: ExtensionContext) {
  ctx.registerBlock({
    with: withNode,
    handlers: {
      onKeyDown: onKeyDown,
    },
    elements: [
      {
        type: ELEMENT_NODE,
        component: NodeComponent,
      },
    ],
  })
}

export * from './constants'

export { isNode as isBlockSelector }
