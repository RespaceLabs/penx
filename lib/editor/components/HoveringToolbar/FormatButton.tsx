import { FC } from 'react'
import { useEditor } from '@/lib/editor-common'
import { ElementType, genId, MarkType } from '@/lib/editor-shared'
import { cn } from '@/lib/utils'
import { Link } from 'lucide-react'
import { Transforms } from 'slate'
import { openLink } from '../../stores/linkIsOpen.store'
import { isMarkActive, toggleMark } from './utils'

const formatMap: Record<string, any> = {
  [MarkType.bold]: 'B',
  [MarkType.italic]: 'I',
  [MarkType.underline]: 'U',
  [MarkType.strike_through]: 'S',
  [ElementType.link]: <Link size={14} />,
}

interface Props {
  format: `${MarkType}` | `${ElementType}`
}

export const FormatButton: FC<Props> = ({ format }) => {
  const editor = useEditor()

  return (
    <div
      className={cn(
        'cursor-pointer flex items-center justify-center px-3 py-2 text-foreground hover:bg-foreground/20',
        isMarkActive(editor, format) && 'bg-foreground/20',
        format === MarkType.underline && 'underline',
        format === MarkType.strike_through && 'line-through',
        format === MarkType.bold && 'font-bold',
      )}
      onMouseDown={(event) => {
        event.preventDefault()
        if (format === ElementType.link) {
          if (!editor.selection) return

          // reset link
          Transforms.unwrapNodes(editor, {
            at: editor.selection,
            match: (n: any) => n.type === format,
          })

          const id = genId()

          Transforms.wrapNodes(
            editor,
            {
              id,
              type: ElementType.link,
              url: '',
              children: [],
            } as any,
            { at: editor.selection, split: true },
          )

          Transforms.collapse(editor, { edge: 'end' })

          setTimeout(() => {
            openLink(id)
          }, 100)
          return
        }
        toggleMark(editor, format)
      }}
    >
      {formatMap[format]}
    </div>
  )
}
