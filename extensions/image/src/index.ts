import { PhotoOutline } from '@bone-ui/icons'
import { ExtensionContext } from '@penx/extension-typings'
import { Image } from './Image'
import { ELEMENT_IMG } from './types'

export function activate(ctx: ExtensionContext) {
  ctx.registerBlock({
    elements: [
      {
        isVoid: true,
        type: ELEMENT_IMG,
        component: Image,
        slashCommand: {
          name: 'Image',
          icon: PhotoOutline,
        },
      },
    ],
  })
}
