import { ICellNode, IColumnNode } from '@penx/model-types'

export interface CellProps {
  index: number
  cell: ICellNode
  column: IColumnNode
  updateCell: (data: any) => void
}
