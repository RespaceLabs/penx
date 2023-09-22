import { ElementType } from '@penx/editor-shared'
import { EditorPlugin } from '@penx/editor-types'
import { DocContent } from './DocContent'

export default function docContent(): EditorPlugin {
  return {
    elements: [
      {
        isVoid: true,
        name: 'Doc Content',
        type: ElementType.doc_content,
        component: DocContent,
        configSchema: [
          {
            name: 'css',
            component: 'CssEditor',
            defaultValue: [
              {
                type: ElementType.atomic_props,
                children: [{ text: 'maxW-860' }],
              },
              {
                type: ElementType.atomic_props,
                children: [{ text: 'pt10' }],
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
