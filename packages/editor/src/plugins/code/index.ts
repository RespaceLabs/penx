import { ElementType } from '@penx/editor-shared'
import { EditorPlugin } from '@penx/editor-types'
import { IconCode } from '../../components/icons/IconCode'
import { CodeBlock } from './ui/CodeBlock'
import { CodeLine } from './ui/CodeLine'
import { withCode } from './withCode'
import './init-prism'

export default function code(): EditorPlugin {
  return {
    with: withCode,
    elements: [
      {
        name: 'Code Block',
        icon: IconCode,
        shouldNested: true,
        type: ElementType.code_block,
        defaultValue: {
          type: ElementType.code_block,
          language: 'js',
          children: [
            {
              type: ElementType.code_line,
              children: [{ text: '' }],
            },
          ],
        },
        component: CodeBlock,
      },
      {
        type: ElementType.code_line,
        component: CodeLine,
      },
    ],
  }
}
