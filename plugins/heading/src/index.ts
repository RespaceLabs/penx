import { Element, Node } from 'slate'
import { PluginContext } from '@penx/plugin-typings'
import { ElementType } from '../custom-types'
import { Heading } from './Heading'
import { IconH1 } from './icons/IconH1'
import { IconH2 } from './icons/IconH2'
import { IconH3 } from './icons/IconH3'
import { withHeading } from './withHeading'

const icons = [IconH1, IconH2, IconH3, IconH3, IconH3, IconH3]

export function activate(ctx: PluginContext) {
  ctx.registerBlock({
    with: withHeading,
    elements: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((item, index) => ({
      type: item,
      component: Heading,
      placeholder: `Heading ${index + 1}`,
      slashCommand: {
        name: `Heading ${index + 1}`,
        icon: icons[index],
      },
    })),
    autoformatRules: [
      {
        mode: 'block',
        type: ElementType.h1,
        match: '# ',
      },
      {
        mode: 'block',
        type: ElementType.h2,
        match: '## ',
      },
      {
        mode: 'block',
        type: ElementType.h3,
        match: '### ',
      },
      {
        mode: 'block',
        type: ElementType.h4,
        match: '#### ',
      },
      {
        mode: 'block',
        type: ElementType.h5,
        match: '##### ',
      },
      {
        mode: 'block',
        type: ElementType.h6,
        match: '###### ',
      },
    ],
  })
}

export function isHeading(
  node: Node,
  headingType?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6',
) {
  const type = (node as Element).type
  if (!headingType) return type === headingType
  return ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(type)
}
