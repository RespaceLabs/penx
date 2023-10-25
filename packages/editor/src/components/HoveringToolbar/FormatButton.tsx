import { FC } from 'react'
import { Box } from '@fower/react'
import { Link } from 'lucide-react'
import { Transforms } from 'slate'
import { useEditor } from '@penx/editor-common'
import { ElementType, genId, MarkType } from '@penx/editor-shared'
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
    <Box
      cursorPointer
      toCenter
      px3
      py2
      black
      bgGray200--hover
      bgGray200={isMarkActive(editor, format)}
      underline={format === MarkType.underline}
      lineThrough={format === MarkType.strike_through}
      fontBold={format === MarkType.bold}
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
    </Box>
  )
}
