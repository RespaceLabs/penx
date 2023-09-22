import { PhotoOutline } from '@bone-ui/icons'
import { ElementType } from '@penx/editor-shared'
import { EditorPlugin } from '@penx/editor-types'
import { Image } from './Image'

export default function image(): EditorPlugin {
  return {
    elements: [
      {
        name: 'Image',
        icon: PhotoOutline,
        isVoid: true,
        type: ElementType.img,
        component: Image,
      },
    ],
  }
}
