import { ElementProps } from '@/lib/extension-typings'
import { FileElement } from '../types'
import { FileView } from './FileView'
import { UploadBox } from './UploadBox'

export const File = (props: ElementProps<FileElement>) => {
  const { element } = props

  if (!element.fileId) {
    return <UploadBox {...props} />
  }

  return <FileView {...props} />
}
