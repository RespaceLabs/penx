import { PhotoOutline } from '@bone-ui/icons'
import { PluginContext } from '@penx/plugin-typings'
import { ElementType } from '../custom-types'
import { Image } from './Image'

export function activate(ctx: PluginContext) {
  ctx.registerBlock({
    elements: [
      {
        name: 'Image',
        icon: PhotoOutline,
        isVoid: true,
        type: ElementType.img,
        component: Image,
      },
    ],
  })
}
