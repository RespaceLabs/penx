import { FC } from 'react'
import { LinkOutline } from '@bone-ui/icons'
import { Box } from '@fower/react'
import { Transforms } from 'slate'
import { useSlate } from 'slate-react'
import { ElementType, genId, MarkType } from '@penx/editor-shared'
import { openLink } from '../../stores/linkIsOpen.store'
import { isMarkActive, toggleMark } from './utils'

const formatMap: Record<string, any> = {
  [MarkType.bold]: 'B',
  [MarkType.italic]: 'I',
  [MarkType.underline]: 'U',
  [MarkType.strike_through]: 'S',
  [ElementType.link]: <LinkOutline size={14} />,
}

interface Props {
  format: `${MarkType}` | `${ElementType}`
}

export const FormatButton: FC<Props> = ({ format }) => {
  const editor = useSlate()

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
            match: (n) => n.type === format,
          })

          const id = genId()

          Transforms.wrapNodes(
            editor,
            {
              id,
              type: ElementType.link,
              url: '',
              children: [],
            },
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
