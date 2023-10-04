import { PluginContext } from '@penx/plugin-typings'
import { CodeBlock } from './ui/CodeBlock'
import { CodeLine } from './ui/CodeLine'
import { withCode } from './withCode'
import './init-prism'
import { IconCode } from './IconCode'
import { insertEmptyCodeBlock } from './insertEmptyCodeBlock'
import { ElementType } from './types'

export function activate(ctx: PluginContext) {
  ctx.registerBlock({
    with: withCode,
    elements: [
      {
        shouldNested: true,
        type: ElementType.code_block,
        component: CodeBlock,
        slashCommand: {
          name: 'Code Block',
          icon: IconCode,
        },
      },
      {
        type: ElementType.code_line,
        component: CodeLine,
      },
    ],
    autoformatRules: [
      {
        mode: 'block',
        type: ElementType.code_block,
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
