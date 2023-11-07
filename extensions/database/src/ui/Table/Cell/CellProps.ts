import { ICellNode } from '@penx/types'

export interface CellProps {
  index: number
  selected: boolean
  cell: ICellNode
  width: number
  updateCell: (data: any) => void
}
