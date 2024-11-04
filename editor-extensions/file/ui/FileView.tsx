import { ElementProps } from '@/lib/extension-typings'
import { useFile } from '@/lib/node-hooks'
import { cn } from '@/lib/utils'
import { Paperclip } from 'lucide-react'
import { useFocused, useSelected, useSlateStatic } from 'slate-react'
import { FileElement } from '../types'

export const FileView = (props: ElementProps<FileElement>) => {
  const { attributes, children, element } = props
  const editor = useSlateStatic()
  const selected = useSelected()
  const focused = useFocused()
  const active = selected && focused
  const { loading, file } = useFile(element.fileId)

  return (
    <div
      {...attributes}
      contentEditable={false}
      className={cn(
        'text-base font-semibold flex items-center gap-2 cursor-pointer rounded px-2 py-2 bg-foreground/5',
        active && 'bg-foreground/5',
      )}
    >
      {loading && <div>{children}</div>}
      {!loading && (
        <>
          <div className="inline-flex bg-foreground/30">
            <Paperclip size={16} />
          </div>
          <div>
            {children}
            {file.name}
          </div>
          <div className="text-foreground/40 text-sm font-normal">
            {file.sizeFormatted}
          </div>
        </>
      )}
    </div>
  )
}
