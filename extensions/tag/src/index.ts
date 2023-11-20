import { ELEMENT_TAG, ELEMENT_TAG_SELECTOR } from '@penx/constants'
import { ExtensionContext } from '@penx/extension-typings'
import { onBlur } from './handlers/onBlur'
import { onKeyDown } from './handlers/onKeyDown'
import { Tag } from './ui/Tag'
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
        type: ELEMENT_TAG_SELECTOR,
        component: TagSelector,
      },
      {
        isInline: true,
        isVoid: true,
        type: ELEMENT_TAG,
        component: Tag,
      },
    ],
  })
}

export * from './isTag'
export * from './ui/Tag'
