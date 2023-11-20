import { Heading1, Heading2, Heading3, Heading4, Heading5 } from 'lucide-react'
import { Node } from 'slate'
import {
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
} from '@penx/constants'
import { ExtensionContext } from '@penx/extension-typings'
import { Heading } from './Heading'
import { HeadingElement } from './types'
import { withHeading } from './withHeading'

const icons = [Heading1, Heading2, Heading3, Heading4, Heading5, Heading5]

export function activate(ctx: ExtensionContext) {
  ctx.registerBlock({
    with: withHeading,
    elements: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((item, index) => ({
      type: item,
      component: Heading,
      placeholder: `Heading ${index + 1}`,
      // slashCommand: {
      //   name: `Heading ${index + 1}`,
      //   icon: icons[index],
      // },
    })),
    autoformatRules: [
      {
        mode: 'block',
        type: ELEMENT_H1,
        match: '# ',
      },
      {
        mode: 'block',
        type: ELEMENT_H2,
        match: '## ',
      },
      {
        mode: 'block',
        type: ELEMENT_H3,
        match: '### ',
      },
      {
        mode: 'block',
        type: ELEMENT_H4,
        match: '#### ',
      },
      {
        mode: 'block',
        type: ELEMENT_H5,
        match: '##### ',
      },
      {
        mode: 'block',
        type: ELEMENT_H6,
        match: '###### ',
      },
    ],
  })
}

export function isHeading(
  node: Node,
  headingType?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6',
) {
  const type = (node as HeadingElement).type
  if (!headingType) {
    return ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(type)
  }

  return type === headingType
}
