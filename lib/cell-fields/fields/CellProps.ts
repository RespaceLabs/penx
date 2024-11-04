import { ICellNode, IColumnNode } from '@/lib/model'

export interface CellProps {
  index: number
  selected: boolean
  cell: ICellNode
  column: IColumnNode
  width: number
  updateCell: (data: any) => void
}
