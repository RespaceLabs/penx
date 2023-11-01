import { ExtensionContext } from '@penx/extension-typings'
import { ELEMENT_TAG } from './constants'
import { onBlur } from './handlers/onBlur'
import { onKeyDown } from './handlers/onKeyDown'
import { TagSelector } from './ui/TagSelector'
import { withTag } from './withTag'

export function activate(ctx: ExtensionContext) {
  ctx.registerBlock({
    with: withTag,
    handlers: {
      onKeyDown: onKeyDown,
      onBlur: onBlur,
    },
    elements: [
      {
        isInline: true,
        type: ELEMENT_TAG,
        component: TagSelector,
      },
    ],
  })
}

export * from './constants'
export * from './isTag'
