import React, { FC, memo, useEffect, useMemo, useRef, useState } from 'react'
import { Box } from '@fower/react'
import { useCombobox, useMultipleSelection, useSelect } from 'downshift'
import {
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  usePopoverContext,
} from 'uikit'
import { IOptionNode } from '@penx/model-types'
import { useDatabaseContext } from '../../DatabaseContext'
import { CellProps } from './CellProps'

export const SingleSelect: FC<CellProps> = memo(function SingleSelect(props) {
  const { cell } = props
  const { options } = useDatabaseContext()
  const [value, setValue] = useState(cell.props.data || '')
  const item = options.find((o) => o.id === value)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Box w-100p h-100p p2>
          {item && (
            <Box
              inlineFlex
              roundedFull
              px2
              py1
              textSM
              color={item?.props.color}
              bg--T90={item?.props.color}
            >
              {item ? item.props.name : ''}
            </Box>
          )}
        </Box>
      </PopoverTrigger>
      <PopoverContent column maxH-300>
        <Combobox {...props} setValue={setValue} />
      </PopoverContent>
    </Popover>
  )
})

function Combobox(props: CellProps & { setValue: any }) {
  const { cell, updateCell } = props
  const { close } = usePopoverContext()
  const { addOption, options } = useDatabaseContext()

  const cellOptions = options.filter(
    (o) => o.props.columnId === cell.props.columnId,
  )

  function getOptionsFilter(inputValue: string) {
    const lowerCasedInputValue = inputValue.toLowerCase()
    return (item: IOptionNode) => {
      return (
        !inputValue ||
        item.props.name.toLowerCase().includes(lowerCasedInputValue)
      )
    }
  }

  const [items, setItems] = useState(cellOptions)
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
      const find = cellOptions.find((o) => o.props.name === inputValue)

      const filteredItems = cellOptions.filter(getOptionsFilter(inputValue))

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
      let id = selectedItem?.id
      if (selectedItem?.id === 'CREATE') {
        const newOption = await addOption(
          cell.props.columnId,
          selectedItem.props.name,
        )
        id = newOption.id
      }

      updateCell(id)
      props.setValue(id)

      setTimeout(() => {
        setInputValue('')
        close()
      }, 0)
    },
  })

  return (
    <Box>
      <Input
        placeholder="Find or create option"
        size="sm"
        variant="unstyled"
        px2
        borderBottom
        roundedNone
        {...getInputProps({
          onChange: (e: any) => {
            setInputValue(e.target.value)
          },
        })}
      />

      <Box p1>
        <Box {...getMenuProps()}>
          {items.map((item, index) => (
            <Box
              bgNeutral100={highlightedIndex === index}
              bgNeutral100--T10={selectedItem === item}
              cursorPointer
              py-6
              px2
              rounded
              toCenterY
              gap2
              key={item.id}
              {...getItemProps({ item, index })}
            >
              {item.id === 'CREATE' && <Box>Create</Box>}
              <Box
                inlineFlex
                roundedFull
                px2
                py1
                textSM
                color={item?.props.color}
                bg--T90={item?.props.color}
                bgNeutral200={!item?.props.color}
              >
                {item ? item.props.name : ''}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
