import { ElementType } from '@penx/editor-shared'
import { EditorPlugin } from '@penx/editor-types'
import { IconText } from '../../components/icons/IconText'
import { Paragraph } from './Paragraph'

export default function paragraph(): EditorPlugin {
  return {
    elements: [
      {
        name: 'Text',
        icon: IconText,
        type: ElementType.p,
        component: Paragraph,
        placeholder: "Type '/' to browse options",
        configSchema: [
          {
            name: 'css',
            component: 'CssEditor',
            value: '',
            defaultValue: [
              {
                type: ElementType.atomic_props,
                children: [{ text: 'py2' }],
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
