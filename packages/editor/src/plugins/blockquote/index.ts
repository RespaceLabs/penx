import { ElementType } from '@penx/editor-shared'
import { EditorPlugin } from '@penx/editor-types'
import { Blockquote } from './Blockquote'

export default function blockquote(): EditorPlugin {
  return {
    elements: [
      {
        name: 'Blockquote',
        type: ElementType.blockquote,
        component: Blockquote,
      },
    ],
  }
}
