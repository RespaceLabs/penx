import { PhotoOutline } from '@bone-ui/icons'
import { ExtensionContext } from '@penx/extension-typings'
import { Image } from './Image'
import { ElementType } from './types'

export function activate(ctx: ExtensionContext) {
  ctx.registerBlock({
    elements: [
      {
        isVoid: true,
        type: ElementType.img,
        component: Image,
        slashCommand: {
          name: 'Image',
          icon: PhotoOutline,
        },
      },
    ],
  })
}
