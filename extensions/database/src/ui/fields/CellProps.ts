import { ICellNode } from '@penx/model-types'

export interface CellProps {
  index: number
  cell: ICellNode
  updateCell: (data: any) => void
}
