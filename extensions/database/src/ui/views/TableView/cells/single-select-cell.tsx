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
import { Input } from 'uikit'
import { IColumnNode, IOptionNode } from '@penx/model-types'
import { useDatabaseContext } from '../../../DatabaseContext'
import { OptionTag } from '../../../shared/OptionTag'
import { roundedRect } from './draw-fns'

interface SingleSelectCellProps {
  kind: 'single-select-cell'
  readonly?: boolean
  column: IColumnNode
  options: IOptionNode[]
  data: string[] // options ids
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
      const color = colors[option.props.color]
      const tagName = option.props.name

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

      const { column } = value.data
      // console.log('date value=====:', value)

      return (
        <Combobox
          column={column}
          onFinishedEditing={onFinishedEditing}
          value={value}
          onChange={onChange}
        />
      )
    },
  }),
}

interface ComboboxProps {
  column: IColumnNode
  value: SingleSelectCell
  onChange: (newValue: SingleSelectCell) => void
  onFinishedEditing: (
    newValue?: SingleSelectCell,
    movement?: readonly [-1 | 0 | 1, -1 | 0 | 1],
  ) => void
}
function Combobox({
  column,
  value,
  onChange,
  onFinishedEditing,
}: ComboboxProps) {
  const { addOption, options } = useDatabaseContext()
  const optionIds = column.props.optionIds || []
  const columnOptions = optionIds.map((o) => options.find((o2) => o2.id === o)!)

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

  const [items, setItems] = useState(columnOptions)
  const [inputValue, setInputValue] = useState('')
  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    selectedItem,
  } = useCombobox({
    inputValue: inputValue,
    onInputValueChange({ inputValue = '' }) {
      setInputValue(inputValue!)
      const find = columnOptions.find((o) => o.props.name === inputValue)
      const filteredItems = columnOptions.filter(getOptionsFilter(inputValue))
      if (!find && inputValue) {
        filteredItems.push({
          id: 'CREATE',
          props: { name: inputValue },
        } as IOptionNode)
      }
      setItems(filteredItems)
    },
    items,
    itemToString(item) {
      return item ? item.props.name : ''
    },
    async onSelectedItemChange({ selectedItem }) {
      let id = selectedItem?.id as string

      if (selectedItem?.id === 'CREATE') {
        const newOption = await addOption(column.id, selectedItem.props.name)
        id = newOption.id
      }

      let newData = [id]

      if (currentIds.includes(id)) {
        newData = []
      }

      const newValue: SingleSelectCell = {
        ...value,
        data: {
          ...value.data,
          data: newData,
        },
      }

      setInputValue('')
      onChange(newValue)
      onFinishedEditing(newValue)
    },
  })

  return (
    <Box>
      <Input
        placeholder="Find or create option"
        size="sm"
        variant="unstyled"
        px2
        autoFocus
        borderBottom
        roundedNone
        {...getInputProps({
          onChange: (e: any) => {
            setInputValue(e.target.value)
          },
        })}
      />

      <Box>
        {!items.length && (
          <Box toCenter p1 gray400 textSM>
            No options
          </Box>
        )}
        <Box p1 maxH-300 overflowAuto {...getMenuProps()}>
          {items.map((item, index) => (
            <Box
              bgNeutral100={highlightedIndex === index}
              bgNeutral100--T10={selectedItem === item}
              cursorPointer
              py-6
              px2
              rounded
              toCenterY
              toBetween
              gap2
              key={item.id}
              {...getItemProps({ item, index })}
            >
              <Box toCenterY gap2>
                {item.id === 'CREATE' && (
                  <Box textXS gray400>
                    Create
                  </Box>
                )}

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
