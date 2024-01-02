import {
  CustomCell,
  CustomRenderer,
  drawTextCell,
  GridCellKind,
  TextCellEntry,
} from '@glideapps/glide-data-grid'

interface RateCellProps {
  kind: 'rate-cell'
  data: string
}

export type RateCell = CustomCell<RateCellProps>

export const RateCellRenderer: CustomRenderer<RateCell> = {
  kind: GridCellKind.Custom,
  isMatch: (c): c is RateCell => (c.data as any).kind === 'rate-cell',
  draw: (args, cell) => {
    const { data = '' } = cell.data
    drawTextCell(args, data)
    return true
  },
  provideEditor: () => ({
    editor: (p) => {
      const { onChange, value } = p

      return (
        <TextCellEntry
          highlight={true}
          // autoFocus={false}
          // disabled={true}
          value={value.data.data ?? ''}
          onChange={(e) => {
            onChange({
              ...value,
              data: {
                ...value.data,
                data: e.target.value,
              },
            })
          }}
        />
      )
    },
  }),
}
