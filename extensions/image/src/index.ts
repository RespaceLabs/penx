import { ImageIcon } from 'lucide-react'
import { ExtensionContext } from '@penx/extension-typings'
import { ELEMENT_IMG } from './types'
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
        // slashCommand: {
        //   name: 'Image',
        //   description: 'Upload an image',
        //   icon: ImageIcon,
        // },
      },
    ],
  })
}
