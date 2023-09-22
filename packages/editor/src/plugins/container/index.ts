import { ElementType } from '@penx/editor-shared'
import { EditorPlugin } from '@penx/editor-types'
import { Container } from './Container'

export default function container(): EditorPlugin {
  return {
    elements: [
      {
        name: 'Container',
        shouldNested: true,
        type: ElementType.container,
        component: Container,
        defaultValue: {
          type: ElementType.container,
          children: [
            {
              type: ElementType.p,
              children: [{ text: '' }],
            },
          ],
        },

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
          {
            name: 'width',
            component: 'Input',
            defaultValue: '860px',
          },
        ],
      },
    ],
  }
}
