import { PluginContext } from '@penx/plugin-typings'
import { IconText } from './IconText'
import { Paragraph } from './Paragraph'

export function activate(ctx: PluginContext) {
  ctx.registerBlock({
    elements: [
      {
        name: 'Text',
        icon: IconText,
        type: 'p',
        component: Paragraph,
        placeholder: "Type '/' to browse options",
      },
    ],
  })
}

export { Paragraph }
