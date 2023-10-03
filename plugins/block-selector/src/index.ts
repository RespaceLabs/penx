import { PluginContext } from '@penx/plugin-typings'
import { ElementType } from '../custom-types'
import { BlockSelector } from './BlockSelector'
import { isBlockSelector } from './isBlockSelector'
import { onKeyDown } from './onKeyDown'
import { withBlockSelector } from './withBlockSelector'

export function activate(ctx: PluginContext) {
  ctx.registerBlock({
    with: withBlockSelector,
    handlers: {
      onKeyDown: onKeyDown,
    },
    elements: [
      {
        isInline: true,
        type: ElementType.block_selector,
        component: BlockSelector,
      },
    ],
  })
}

export { isBlockSelector }
