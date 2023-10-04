import { Element, Node } from 'slate'
import { PluginContext } from '@penx/plugin-typings'
import { getEmptyParagraph } from './getEmptyParagraph'
import { IconText } from './IconText'
import { insertEmptyParagraph } from './insertEmptyParagraph'
import { Paragraph } from './Paragraph'
import { ElementType, ParagraphElement } from './types'

export function activate(ctx: PluginContext) {
  ctx.registerBlock({
    elements: [
      {
        type: ElementType.p,
        component: Paragraph,
        placeholder: "Type '/' to browse options",
        slashCommand: {
          name: 'Text',
          icon: IconText,
        },
      },
    ],
  })
}

export function isParagraph(node: Node) {
  return (node as ParagraphElement).type === ElementType.p
}

export * from './types'

export { Paragraph, insertEmptyParagraph, getEmptyParagraph }
