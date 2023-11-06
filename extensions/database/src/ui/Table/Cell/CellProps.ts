import { ICellNode } from '@penx/types'

export interface CellProps {
  index: number
  selected: boolean
  cell: ICellNode
  width: number
  element: any
  updateCell: (data: any) => void
}
