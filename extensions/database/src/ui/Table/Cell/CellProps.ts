import { ICellNode } from '@penx/model-types'

export interface CellProps {
  index: number
  selected: boolean
  cell: ICellNode
  width: number
  updateCell: (data: any) => void
}
