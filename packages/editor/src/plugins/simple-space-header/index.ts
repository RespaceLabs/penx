import { ElementType } from '@penx/editor-shared'
import { EditorPlugin } from '@penx/editor-types'
import { SimpleSpaceHeader } from './SimpleSpaceHeader'

export default function simpleSpaceHeader(): EditorPlugin {
  return {
    elements: [
      {
        isVoid: true,
        name: 'Simple Space Header',
        type: ElementType.simple_space_header,
        component: SimpleSpaceHeader,
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
