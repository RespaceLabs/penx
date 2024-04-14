import { ImageIcon } from 'lucide-react'
import { ELEMENT_IMG } from '@penx/constants'
import { ExtensionContext } from '@penx/extension-typings'
import { Image } from './ui/Image'
import { withImage } from './withImage'

export function activate(ctx: ExtensionContext) {
  ctx.registerBlock({
    with: withImage,
    elements: [
      {
        isVoid: true,
        type: ELEMENT_IMG,
        component: Image,
        slashCommand: {
          name: 'Image',
          in: ['BLOCK', 'OUTLINER'],
          description: 'Upload an image',
          icon: ImageIcon,
        },
      },
    ],
  })
}
