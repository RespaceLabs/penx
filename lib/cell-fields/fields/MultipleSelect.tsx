import React, {
  Dispatch,
  FC,
  memo,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import isEqual from 'react-fast-compare'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useDatabaseContext } from '@/lib/database-context'
import { IOptionNode } from '@/lib/model'
import { cn } from '@/lib/utils'
import { OptionTag } from '@/lib/widget'

import { useCombobox, useMultipleSelection, useSelect } from 'downshift'
import { CellProps } from './CellProps'

export const MultipleSelectCell: FC<CellProps> = memo(
  function MultipleSelectCell(props) {
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
          <div className="flex items-center gap-1 flex-wrap w-full h-10 p-2 border border-foreground/15 rounded-xl cursor-pointer">
            {items.map((option) => (
              <OptionTag
                key={option.id}
                option={{
                  id: option?.props?.columnId,
                  name: option?.props?.name,
                  color: option?.props?.color,
                }}
                deletable
                onDelete={async () => {
                  await deleteCellOption(cell.id, option.id)
                }}
              />
            ))}
          </div>
        </PopoverTrigger>
        <PopoverContent>
          <Combobox {...props} value={value} setValue={setValue} />
        </PopoverContent>
      </Popover>
    )
  },
)

function Combobox(
  props: CellProps & {
    value: string[]
    setValue: Dispatch<SetStateAction<string[]>>
  },
) {
  const { cell, column, updateCell } = props
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
        const oldIds = cell.props.data || []
        const existed = oldIds.includes(id)

        if (!existed) {
          const newIds = [...oldIds, id]
          updateCell(newIds)
          props.setValue(newIds)
        }

        setInputValue('')
        // close()
      }, 10)
    },
  })

  return (
    <div>
      <Input
        placeholder="Find or create option"
        size="sm"
        {...getInputProps({
          onChange: (e: any) => {
            setInputValue(e.target.value)
          },
        })}
      />

      <div>
        {!items.length && (
          <div className="flex items-center justify-center p-1 text-foreground/400 text-sm">
            No options
          </div>
        )}
        <div className="p-1 max-h-[300px] overflow-auto" {...getMenuProps()}>
          {items.map((item, index) => (
            <div
              className={cn(
                'flex items-center gap-2 rounded px-2 py-2 cursor-pointer',
                highlightedIndex === index && 'bg-foreground/5',
                selectedItem === item && 'bg-foreground/10',
              )}
              key={item.id}
              {...getItemProps({ item, index })}
            >
              {item.id === 'CREATE' && <div>Create</div>}

              <OptionTag
                option={{
                  id: item?.props?.columnId,
                  name: item?.props?.name,
                  color: item?.props?.color,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
