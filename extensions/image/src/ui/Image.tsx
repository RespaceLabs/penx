import { ElementProps } from '@penx/extension-typings'
import { ImageElement } from '../types'
import { ImageView } from './ImageView'
import { UploadBox } from './UploadBox'

export const Image = (props: ElementProps<ImageElement>) => {
  const { element } = props

  if (!element.fileId) {
    return <UploadBox {...props} />
  }

  return <ImageView {...props} />
}
