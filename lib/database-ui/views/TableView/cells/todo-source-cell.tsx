
import {
  CustomCell,
  CustomRenderer,
  drawTextCell,
  GridCellKind,
} from '@glideapps/glide-data-grid'
import { INode } from '@/lib/model'

interface TodoSourceCellProps {
  kind: 'todo-source-cell'

  data: INode | null
}

export type TodoSourceCell = CustomCell<TodoSourceCellProps>

export const todoSourceCellRenderer: CustomRenderer<TodoSourceCell> = {
  kind: GridCellKind.Custom,
  isMatch: (c): c is TodoSourceCell =>
    (c.data as any).kind === 'todo-source-cell',
  draw: (args, cell) => {
    drawTextCell(args, cell.data?.data?.date || '')
    return true
  },
}
