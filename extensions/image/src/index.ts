import { ImageIcon } from 'lucide-react'
import { ExtensionContext } from '@penx/extension-typings'
import { ELEMENT_IMG } from './types'
import { Image } from './ui/Image'

export function activate(ctx: ExtensionContext) {
  ctx.registerBlock({
    elements: [
      {
        isVoid: true,
        type: ELEMENT_IMG,
        component: Image,
        slashCommand: {
          name: 'Image',
          icon: ImageIcon,
        },
      },
    ],
  })
}
