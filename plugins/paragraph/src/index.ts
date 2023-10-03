import { Element, Node } from 'slate'
import { PluginContext } from '@penx/plugin-typings'
import { ElementType } from '../custom-types'
import { getEmptyParagraph } from './getEmptyParagraph'
import { IconText } from './IconText'
import { insertEmptyParagraph } from './insertEmptyParagraph'
import { Paragraph } from './Paragraph'

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
  return (node as Element).type === ElementType.p
}

export { Paragraph, insertEmptyParagraph, getEmptyParagraph }
