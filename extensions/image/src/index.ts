import { ImageIcon } from 'lucide-react'
import {
  ELEMENT_FILE_CAPTION,
  ELEMENT_FILE_CONTAINER,
  ELEMENT_IMG,
} from '@penx/constants'
import { ExtensionContext } from '@penx/extension-typings'
import { FileCaptionElement, FileContainerElement, ImageElement } from './types'
import { FileCaption } from './ui/FileCaption'
import { FileContainer } from './ui/FileContainer'
import { Image } from './ui/Image'
import { withImage } from './withImage'

export function activate(ctx: ExtensionContext) {
  ctx.registerBlock({
    with: withImage,
    elements: [
      {
        // isVoid: true,
        shouldNested: true,
        type: ELEMENT_FILE_CONTAINER,
        component: FileContainer,
        slashCommand: {
          name: 'Image',
          in: ['BLOCK', 'OUTLINER'],
          description: 'Upload an image',
          icon: ImageIcon,
          defaultNode: {
            type: ELEMENT_FILE_CONTAINER,
            children: [
              {
                type: ELEMENT_IMG,
                children: [{ text: '' }],
              } as ImageElement,

              {
                type: ELEMENT_FILE_CAPTION,
                children: [{ text: '' }],
              } as FileCaptionElement,
            ],
          } as FileContainerElement,
        },
      },
      {
        isVoid: true,
        type: ELEMENT_IMG,
        component: Image,
      },
      {
        type: ELEMENT_FILE_CAPTION,
        component: FileCaption,
      },
    ],
  })
}
