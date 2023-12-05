import { Box } from '@fower/react'
import { useEditor } from '@penx/editor-common'
import { insertEmptyList } from '../../transforms/insertEmptyList'

export const EmptyTips = () => {
  const editor = useEditor()

  function insertList() {
    insertEmptyList(editor, { at: [1], select: true })
  }

  return (
    <Box
      contentEditable={false}
      gray300
      textSM
      fontNormal
      mt5
      onClick={insertList}
    >
      Write something...
    </Box>
  )
}
