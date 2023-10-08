import { Node } from 'slate'
import { ExtensionContext } from '@penx/extension-typings'
import { getEmptyParagraph } from './getEmptyParagraph'
import { IconText } from './IconText'
import { insertEmptyParagraph } from './insertEmptyParagraph'
import { Paragraph } from './Paragraph'
import { ELEMENT_P, ParagraphElement } from './types'

export function activate(ctx: ExtensionContext) {
  ctx.registerBlock({
    elements: [
      {
        type: ELEMENT_P,
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
  return (node as ParagraphElement).type === ELEMENT_P
}

export * from './types'

export { Paragraph, insertEmptyParagraph, getEmptyParagraph }
