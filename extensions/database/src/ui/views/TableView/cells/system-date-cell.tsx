import {
  CustomCell,
  CustomRenderer,
  drawTextCell,
  GridCellKind,
} from '@glideapps/glide-data-grid'
import { format } from 'date-fns'
import { FieldType, ICellNode, IRowNode } from '@penx/model-types'

interface SystemDateCellProps {
  kind: 'system-date-cell'
  data: IRowNode
  type: FieldType.CREATED_AT | FieldType.UPDATED_AT
}

export type SystemDateCell = CustomCell<SystemDateCellProps>

export const systemDateCellRenderer: CustomRenderer<SystemDateCell> = {
  kind: GridCellKind.Custom,
  isMatch: (c): c is SystemDateCell =>
    (c.data as any).kind === 'system-date-cell',
  draw: (args, cell) => {
    const rowNode = cell.data.data

    const date =
      cell.data.type === FieldType.CREATED_AT
        ? rowNode.createdAt
        : rowNode.updatedAt

    const str = format(new Date(date), 'yyyy-MM-dd HH:mm:ss')

    drawTextCell(args, str)
    return true
  },
  provideEditor: () => ({
    disablePadding: true,
    editor: (p) => {
      return null
    },
  }),
}
