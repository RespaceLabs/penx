import { OptionTag } from '@/lib/widget'
import { transparentize } from '@fower/color-helper'
import {
  CustomCell,
  CustomRenderer,
  getMiddleCenterBias,
  GridCellKind,
  Item,
  measureTextCached,
  Rectangle,
} from '@glideapps/glide-data-grid'
import { Check } from 'lucide-react'
import { roundedRect } from '../cells/draw-fns'

interface TaskOptions {
  id: string
  name: string
  color: string
}

interface SelectCellProps {
  kind: 'select-cell'
  readonly?: boolean
  dataSource: TaskOptions[]
  value: string
  cell: Item
  isMultiple?: boolean
  updateCellFn: (cell: Item, newValue: string) => void
}

const tagHeight = 20
const innerPad = 6

export type SelectCell = CustomCell<SelectCellProps>

export const selectCellRenderer: CustomRenderer<SelectCell> = {
  kind: GridCellKind.Custom,
  isMatch: (c): c is SelectCell => (c.data as any).kind === 'select-cell',
  draw: (args, cell) => {
    const { ctx, theme, rect } = args
    const { value, dataSource } = cell.data
    const ids: string[] = value ? value.toString().split(',') : []
    const options = ids
      .map((id) => dataSource.find((o) => o.id === id)!)
      .filter(Boolean)

    const drawArea: Rectangle = {
      x: rect.x + theme.cellHorizontalPadding,
      y: rect.y + theme.cellVerticalPadding,
      width: rect.width - 2 * theme.cellHorizontalPadding,
      height: rect.height - 2 * theme.cellVerticalPadding,
    }
    const rows = Math.max(
      1,
      Math.floor(drawArea.height / (tagHeight + innerPad)),
    )

    let x = drawArea.x
    let row = 1
    let y =
      drawArea.y +
      (drawArea.height - rows * tagHeight - (rows - 1) * innerPad) / 2
    for (const option of options) {
      // const colors: any = fowerStore.config.theme.colors
      // TODO:
      const colors: any = {}
      const color = colors[option.color]
      const tagName = option.name

      ctx.font = `12px ${theme.fontFamily}`
      const metrics = measureTextCached(tagName, ctx)
      const width = metrics.width + innerPad * 2
      const textY = tagHeight / 2

      if (
        x !== drawArea.x &&
        x + width > drawArea.x + drawArea.width &&
        row < rows
      ) {
        row++
        y += tagHeight + innerPad
        x = drawArea.x
      }

      // ctx.fillStyle = color
      ctx.fillStyle = transparentize(color, 85)

      ctx.beginPath()
      roundedRect(ctx, x, y, width, tagHeight, tagHeight / 2)
      ctx.fill()

      // ctx.fillStyle = theme.textDark
      ctx.fillStyle = color
      ctx.fillText(
        tagName,
        x + innerPad,
        y + textY + getMiddleCenterBias(ctx, `12px ${theme.fontFamily}`),
      )

      x += width + 8
      if (x > drawArea.x + drawArea.width && row >= rows) break
    }

    return true
  },
  provideEditor: () => ({
    disablePadding: true,
    editor: (p) => {
      const { onChange, value, onFinishedEditing } = p
      const { dataSource, updateCellFn } = value.data

      return (
        <Combobox
          dataSource={dataSource}
          onFinishedEditing={onFinishedEditing}
          value={value}
          updateCellFn={updateCellFn}
        />
      )
    },
  }),
}

interface ComboboxProps {
  dataSource: TaskOptions[]
  value: SelectCell
  updateCellFn: (cell: Item, newValue: string) => void
  onFinishedEditing: (
    newValue?: SelectCell,
    movement?: readonly [-1 | 0 | 1, -1 | 0 | 1],
  ) => void
}

function Combobox({
  dataSource,
  value,
  onFinishedEditing,
  updateCellFn,
}: ComboboxProps) {
  const { value: currentId, cell, isMultiple = false } = value.data
  const currentIds = currentId ? currentId.split(',') : []

  function onSelectedItemChange(option: TaskOptions) {
    if (isMultiple) {
      const isIn = currentIds.includes(option.id)
      if (!isIn) {
        currentIds.push(option.id)
      } else {
        const indexToDelete = currentIds.indexOf(option.id)
        if (indexToDelete !== -1) {
          currentIds.splice(indexToDelete, 1)
        }
      }

      updateCellFn(cell, currentIds.join(','))
    } else {
      updateCellFn(cell, currentId === option.id ? '' : option.id)
    }
    onFinishedEditing()
  }

  return (
    <div>
      <div className="p1 max-h-[300px] overflow-hidden">
        {dataSource.map((item) => (
          <div
            className="cursor-pointer py-[6px] px-2 rounded flex items-center justify-between gap-2"
            key={item.id}
            onClick={() => onSelectedItemChange(item)}
          >
            <div className="flex items-center gap-2">
              <OptionTag
                option={item}
                showClose={currentIds.includes(item.id)}
              />
            </div>

            {currentIds.includes(item.id) && (
              <div className="inline-flex text-foreground/50">
                <Check size={14} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
