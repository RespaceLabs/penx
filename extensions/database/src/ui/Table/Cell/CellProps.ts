import { ICellNode } from '@penx/types'

export interface CellProps {
  selected: boolean
  cell: ICellNode
  width: number
  updateCell: (data: any) => void
}
