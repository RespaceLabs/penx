import { ElementType } from '@penx/editor-shared'
import { EditorPlugin } from '@penx/editor-types'
import { Divider } from './Divider'

export default function divider(): EditorPlugin {
  return {
    elements: [
      {
        isVoid: true,
        name: 'Divider',
        type: ElementType.hr,
        component: Divider,
      },
    ],
  }
}
