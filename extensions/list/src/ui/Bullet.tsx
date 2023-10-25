import { Box } from '@fower/react'
import { useSlate } from 'slate-react'
import { useEditor } from '@penx/editor-common'
import { ListContentElement } from '../types'

interface Props {
  element: ListContentElement
}

export const Bullet = ({ element }: Props) => {
  const editor = useEditor()
  const { collapsed = false } = element

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
