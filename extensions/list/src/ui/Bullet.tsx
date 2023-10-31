import { Box } from '@fower/react'
import { Editor, Node } from 'slate'
import { useSelected, useSlate } from 'slate-react'
import { useEditor } from '@penx/editor-common'
import { listSchema } from '../listSchema'
import { ListContentElement } from '../types'

interface Props {
  element: ListContentElement
}

export const Bullet = ({ element }: Props) => {
  const editor = useEditor()
  const { collapsed = false } = element
  const str = Node.string(element)

  const currentElement = (() => {
    if (!editor.selection) return null
    const res = Editor.nodes(editor, {
      mode: 'lowest',
      at: editor.selection,
      match: listSchema.isListItemTextNode,
    })

    const licEntries = Array.from(res)
    if (!licEntries.length) return null
    return licEntries[0][0]
  })()

  const isFocused = currentElement === element
  const isBulletVisible = !!str || isFocused

  if (!isBulletVisible) return null

  return (
    <Box
      className="bullet"
      square-15
      bgTransparent
      bgGray200--hover
      bgGray200={collapsed}
      toCenter
      roundedFull
      cursorPointer
      flexShrink-1
      onClick={() => {
        editor.onClickBullet(element)
      }}
    >
      <Box
        square-5
        bgGray400
        roundedFull
        transitionCommon
        scale-130--$bullet--hover
      />
    </Box>
  )
}
