import { ElementProps } from '@/lib/extension-typings'
import { FileCaptionElement } from '../types'

export const FileCaption = ({
  attributes,
  children,
  element,
}: ElementProps<FileCaptionElement>) => {
  return (
    <div className="text-sm text-foreground/40 py-1" {...attributes}>
      {children}
    </div>
  )
}
