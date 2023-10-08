import { ExtensionContext } from '@penx/extension-typings'
import { ELEMENT_BLOCK_SELECTOR } from './constants'
import { isBlockSelector } from './isBlockSelector'
import { onKeyDown } from './onKeyDown'
import { BlockSelector } from './ui/BlockSelector'
import { withBlockSelector } from './withBlockSelector'

export function activate(ctx: ExtensionContext) {
  ctx.registerBlock({
    with: withBlockSelector,
    handlers: {
      onKeyDown: onKeyDown,
    },
    elements: [
      {
        isInline: true,
        type: ELEMENT_BLOCK_SELECTOR,
        component: BlockSelector,
      },
    ],
  })
}

export * from './constants'

export { isBlockSelector }
