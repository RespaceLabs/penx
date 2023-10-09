import { ImageIcon } from 'lucide-react'
import { ExtensionContext } from '@penx/extension-typings'
import { Image } from './Image'
import { ELEMENT_IMG } from './types'

export function activate(ctx: ExtensionContext) {
  ctx.registerBlock({
    elements: [
      {
        isVoid: true,
        type: ELEMENT_IMG,
        component: ImageIcon,
        slashCommand: {
          name: 'Image',
          icon: Image,
        },
      },
    ],
  })
}
