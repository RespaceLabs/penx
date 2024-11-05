import { ElementProps } from '@/lib/extension-typings'
import { ImageElement } from '../types'
import { ImageView } from './ImageView'
import { UploadBox } from './UploadBox'

export const Image = (props: ElementProps<ImageElement>) => {
  const { element } = props

  if (!element.url) {
    return <UploadBox {...props} />
  }

  return <ImageView {...props} />
}
