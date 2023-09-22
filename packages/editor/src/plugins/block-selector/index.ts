import { ElementType } from '@penx/editor-shared'
import { EditorPlugin } from '@penx/editor-types'
import { BlockSelector } from './BlockSelector'
import { withBlockSelector } from './withBlockSelector'

export default function blockSelector(): EditorPlugin {
  return {
    with: withBlockSelector,
    elements: [
      {
        isInline: true,
        type: ElementType.block_selector,
        component: BlockSelector,
      },
    ],
  }
}
