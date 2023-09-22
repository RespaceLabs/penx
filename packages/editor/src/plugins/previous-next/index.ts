import { ElementType } from '@penx/editor-shared'
import { EditorPlugin } from '@penx/editor-types'
import { PreviousNext } from './PreviousNext'

export default function previousNext(): EditorPlugin {
  return {
    elements: [
      {
        isVoid: true,
        name: 'Previous Next',
        type: ElementType.previous_next,
        component: PreviousNext,
        configSchema: [
          {
            name: 'css',
            component: 'CssEditor',
            defaultValue: [
              {
                type: ElementType.atomic_props,
                children: [{ text: 'py4' }],
              },
              {
                type: ElementType.atomic_props_input,
                children: [{ text: '' }],
              },
            ],
          },
        ],
      },
    ],
  }
}
