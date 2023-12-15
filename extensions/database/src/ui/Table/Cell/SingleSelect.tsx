import React, {
  Dispatch,
  FC,
  memo,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import isEqual from 'react-fast-compare'
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
import { OptionTag } from '../../shared/OptionTag'
import { CellProps } from './CellProps'

export const SingleSelectCell: FC<CellProps> = memo(
  function SingleSelectCell(props) {
    const { cell } = props
    const { options, deleteCellOption } = useDatabaseContext()
    const [value, setValue] = useState<string[]>(
      Array.isArray(cell.props.data) ? cell.props.data : [],
    )

    const items = (Array.isArray(value) ? value : [])
      .map((item) => options.find((o) => o.id === item)!)
      .filter((o) => !!o)

    useEffect(() => {
      if (isEqual(value, cell.props.data)) return
      setValue(cell.props.data)

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cell.props.data])

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Box w-100p h-100p p2>
            {items.map((option) => (
              <OptionTag
                key={option.id}
                option={option}
                deletable
                onDelete={async () => {
                  await deleteCellOption(cell.id, option.id)
                }}
              />
            ))}
          </Box>
        </PopoverTrigger>
        <PopoverContent column>
          <Combobox {...props} setValue={setValue} />
        </PopoverContent>
      </Popover>
    )
  },
)

function Combobox(
  props: CellProps & {
    setValue: Dispatch<SetStateAction<string[]>>
  },
) {
  const { cell, column, updateCell } = props
  const { close } = usePopoverContext()
  const { addOption, options } = useDatabaseContext()
  const optionIds = column.props.optionIds || []
  const columnOptions = optionIds.map((o) => options.find((o2) => o2.id === o)!)

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
        const newOption = await addOption(
          cell.props.columnId,
          selectedItem.props.name,
        )
        id = newOption.id
      }

      setTimeout(() => {
        updateCell([id])
        props.setValue([id])
        setInputValue('')
        close()
      }, 10)
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
              gap2
              key={item.id}
              {...getItemProps({ item, index })}
            >
              {item.id === 'CREATE' && <Box>Create</Box>}

              <OptionTag option={item} />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
