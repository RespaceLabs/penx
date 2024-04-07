import { ICellNode, IColumnNode } from '@penx/model-types'

export interface CellProps {
  index: number
  selected: boolean
  cell: ICellNode
  column: IColumnNode
  width: number
  updateCell: (data: any) => void
}
