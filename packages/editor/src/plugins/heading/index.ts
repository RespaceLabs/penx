import { ElementType } from '@penx/editor-shared'
import { EditorPlugin } from '@penx/editor-types'
import { IconH1 } from '../../components/icons/IconH1'
import { IconH2 } from '../../components/icons/IconH2'
import { IconH3 } from '../../components/icons/IconH3'
import { Heading } from './Heading'
import { withHeading } from './withHeading'

const icons = [IconH1, IconH2, IconH3, IconH3, IconH3, IconH3]

export default function heading(): EditorPlugin {
  return {
    with: withHeading,
    elements: [
      ElementType.h1,
      ElementType.h2,
      ElementType.h3,
      ElementType.h4,
      ElementType.h5,
      ElementType.h6,
    ].map((item, index) => ({
      type: item,
      name: `Heading ${index + 1}`,
      icon: icons[index],
      component: Heading,
      placeholder: `Heading ${index + 1}`,
      configSchema: [
        {
          name: 'css',
          component: 'CssEditor',
          defaultValue: [
            {
              type: ElementType.atomic_props,
              children: [{ text: 'py2' }],
            },
            {
              type: ElementType.atomic_props,
              children: [{ text: 'fontBold' }],
            },
            {
              type: ElementType.atomic_props_input,
              children: [{ text: '' }],
            },
          ],
        },
      ],
    })),
  }
}
