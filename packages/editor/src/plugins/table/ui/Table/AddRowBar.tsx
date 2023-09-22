import { PlusOutline } from '@bone-ui/icons'
import { Box } from '@fower/react'
import { useSlate, useSlateStatic } from 'slate-react'
import { TableElement } from '@penx/editor-types'
import { TableNode } from '../../nodes/TableNode'

interface Props {
  element: TableElement
}

export const AddRowBar = ({ element }: Props) => {
  const editor = useSlateStatic()
  function addRow() {
    const table = new TableNode(editor, element)
    table.addRow()
  }

  return (
    <Box
      absolute
      toCenter
      rounded
      h4
      bgGray200
      mt1
      opacity-0
      w-100p
      opacity-100--hover
      transitionCommon
      cursorPointer
      onClick={addRow}
    >
      <PlusOutline size={16} gray500 />
    </Box>
  )
}
