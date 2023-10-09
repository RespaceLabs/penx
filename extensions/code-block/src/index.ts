import { ExtensionContext } from '@penx/extension-typings'
import { CodeBlock } from './ui/CodeBlock'
import { CodeLine } from './ui/CodeLine'
import { withCode } from './withCode'
import './init-prism'
import { ELEMENT_CODE_BLOCK, ELEMENT_CODE_LINE } from './constants'
import { IconCode } from './IconCode'
import { insertEmptyCodeBlock } from './transforms/insertEmptyCodeBlock'
import { CodeBlockElement, CodeLineElement } from './types'

export function activate(ctx: ExtensionContext) {
  ctx.defineSettings([
    {
      label: 'Show Lines Numbers',
      name: 'showLineNumbers',
      component: 'Checkbox',
      description: '',
    },
  ])

  ctx.registerBlock({
    with: withCode,
    elements: [
      {
        shouldNested: true,
        type: ELEMENT_CODE_BLOCK,
        component: CodeBlock,
        slashCommand: {
          name: 'Code Block',
          icon: IconCode,
          defaultNode: {
            type: ELEMENT_CODE_BLOCK,
            language: 'js',
            children: [
              {
                type: ELEMENT_CODE_LINE,
                children: [{ text: '' }],
              } as CodeLineElement,
            ],
          } as CodeBlockElement,
        },
      },
      {
        type: ELEMENT_CODE_LINE,
        component: CodeLine,
      },
    ],
    autoformatRules: [
      {
        mode: 'block',
        type: ELEMENT_CODE_BLOCK,
        match: '```',
        triggerAtBlockStart: false,
        format: (editor) => {
          insertEmptyCodeBlock(editor, {})
        },
      },
    ],
  })
}

export * from './guard'
export * from './SetNodeToDecorations/SetNodeToDecorations'
