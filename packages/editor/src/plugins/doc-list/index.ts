import { ElementType } from '@penx/editor-shared'
import { EditorPlugin } from '@penx/editor-types'
import { DocListElement } from './DocList'

export default function docList(): EditorPlugin {
  return {
    elements: [
      {
        isVoid: true,
        name: 'Doc List',
        type: ElementType.doc_list,
        component: DocListElement,
      },
    ],
  }
}
