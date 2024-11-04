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
    <div
      className="absolute flex items-center justify-center rounded top-0 -right-5 h-full w-4 bg-foreground/20 opacity-0 hover:opacity-100 transition-all cursor-pointer"
      onClick={addColumn}
    >
      <Plus size={16} />
    </div>
  )
}
