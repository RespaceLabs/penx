import { ElementType } from '@penx/editor-shared'
import { EditorPlugin } from '@penx/editor-types'
import { Link } from './Link'
import { withLink } from './withLink'

export default function link(): EditorPlugin {
  return {
    with: withLink,
    elements: [
      {
        isInline: true,
        name: 'Link',
        type: ElementType.link,
        component: Link,
      },
    ],
  }
}
