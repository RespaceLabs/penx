import { ElementProps } from '@/lib/extension-typings'
import { FileContainerElement } from '../types'

export const FileContainer = ({
  attributes,
  children,
}: ElementProps<FileContainerElement>) => {
  return (
    <div className="my-2" {...attributes}>
      {children}
    </div>
  )
}
