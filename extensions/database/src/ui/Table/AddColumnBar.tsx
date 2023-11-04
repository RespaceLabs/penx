import { Box } from '@fower/react'
import { Plus } from 'lucide-react'
import { useSlateStatic } from 'slate-react'
import { TableNode } from '../../nodes/TableNode'
import { TableElement } from '../../types'

interface Props {
  element: TableElement
}

export const AddColumnBar = ({ element }: Props) => {
  const editor = useSlateStatic()
  function addColumn() {
    const table = new TableNode(editor, element)
    table.addColumn()
  }

  return (
    <Box
      absolute
      toCenter
      rounded
      top0
      right--20
      h-100p
      w4
      bgGray200
      opacity-0
      opacity-100--hover
      transitionCommon
      cursorPointer
      onClick={addColumn}
    >
      <Plus size={16} />
    </Box>
  )
}
