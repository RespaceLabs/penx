import { Box } from '@fower/react'
import { Plus } from 'lucide-react'
import { useSlateStatic } from 'slate-react'
import { TableNode } from '../../nodes/TableNode'
import { TableElement } from '../../types'

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
      <Plus size={16} />
    </Box>
  )
}
