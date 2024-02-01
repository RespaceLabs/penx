import { useState } from 'react'
import { transparentize } from '@fower/color-helper'
import { Box, fowerStore } from '@fower/react'
import {
  CustomCell,
  CustomRenderer,
  drawTextCell,
  getMiddleCenterBias,
  GridCellKind,
  measureTextCached,
  Rectangle,
  TextCellEntry,
} from '@glideapps/glide-data-grid'
import { useCombobox } from 'downshift'
import { Check } from 'lucide-react'
import { IColumnNode, IOptionNode } from '@penx/model-types'
import { useDatabaseContext } from '../../../DatabaseContext'
import { OptionTag } from '../../../shared/OptionTag'
import { roundedRect } from '../cells/draw-fns'

interface TaskOptions {
  id: string
  name: string
  color: string
}

interface SingleSelectCellProps {
  kind: 'single-select-cell'
  readonly?: boolean
  dataSource: TaskOptions[]
  options: TaskOptions[]
  data: string[]
}

const tagHeight = 20
const innerPad = 6

export type SingleSelectCell = CustomCell<SingleSelectCellProps>

export const singleSelectCellRenderer: CustomRenderer<SingleSelectCell> = {
  kind: GridCellKind.Custom,
  isMatch: (c): c is SingleSelectCell =>
    (c.data as any).kind === 'single-select-cell',
  draw: (args, cell) => {
    const { ctx, theme, rect } = args
    const { options = [] } = cell.data

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
      const colors: any = fowerStore.config.theme.colors
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
      const {
        onChange,
        value,
        forceEditMode,
        validatedSelection,
        onFinishedEditing,
      } = p

      const { dataSource } = value.data
      // console.log('date value=====:', value)

      return (
        <Combobox
          dataSource={dataSource}
          onFinishedEditing={onFinishedEditing}
          value={value}
          onChange={onChange}
        />
      )
    },
  }),
}

interface ComboboxProps {
  dataSource: TaskOptions[]
  value: SingleSelectCell
  onChange: (newValue: SingleSelectCell) => void
  onFinishedEditing: (
    newValue?: SingleSelectCell,
    movement?: readonly [-1 | 0 | 1, -1 | 0 | 1],
  ) => void
}

function Combobox({
  dataSource,
  value,
  onChange,
  onFinishedEditing,
}: ComboboxProps) {
  const currentIds = value.data.data || []

  function getOptionsFilter(inputValue: string) {
    const lowerCasedInputValue = inputValue.toLowerCase()
    return (item: IOptionNode) => {
      return (
        !inputValue ||
        item.props.name.toLowerCase().includes(lowerCasedInputValue)
      )
    }
  }

  return (
    <Box>
      <Box>
        <Box p1 maxH-300 overflowAuto>
          {dataSource.map((item, index) => (
            <Box
              cursorPointer
              py-6
              px2
              rounded
              toCenterY
              toBetween
              gap2
              key={item.id}
            >
              <Box toCenterY gap2>
                <OptionTag
                  option={item}
                  showClose={currentIds.includes(item.id)}
                />
              </Box>

              {currentIds.includes(item.id) && (
                <Box inlineFlex gray500>
                  <Check size={14} />
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
