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
    const { ctx, rect } = args

    const x = rect.x + rect.width / 2
    const y = rect.y + rect.height / 2
    const size = (Math.min(rect.width, rect.height) / 2) * 0.8

    ctx.save()
    ctx.beginPath()
    ctx.translate(x, y)
    ctx.rotate(0.02)
    for (let i = 0; i < 5; i++) {
      ctx.rotate((Math.PI / 180) * 72)
      ctx.lineTo(0, 0 - size / 2)
      ctx.rotate((Math.PI / 180) * 72)
      ctx.lineTo(0, 0 - size)
    }

    ctx.fillStyle = 'gray'
    ctx.strokeStyle = 'gray'
    ctx.fill()
    ctx.stroke()

    ctx.restore()

    return true
  },
  provideEditor: () => ({
    editor: (p) => {
      const { onChange, value } = p

      return (
        <TextCellEntry
          highlight={true}
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
