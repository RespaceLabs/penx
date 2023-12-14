import React, { FC, memo, useRef, useState } from 'react'
import { Box } from '@fower/react'
import { useSelect } from 'downshift'
import { Input } from 'uikit'
import { IOptionNode } from '@penx/model-types'
import { useDatabaseContext } from '../../DatabaseContext'
import { CellProps } from './CellProps'

export const MultipleSelect: FC<CellProps> = memo(
  function MultipleSelect(props) {
    const { cell, updateCell } = props
    const [q, setQ] = useState('')
    const { addOption, options } = useDatabaseContext()

    const cellOptions = options
      .filter((o) => o.props.columnId === cell.props.columnId)
      .filter((o) => {
        if (!q) return true
        return o.props.name.toLowerCase().includes(q.toLowerCase())
      })

    const option = cellOptions.find((o) => o.id === cell.props.data)

    function itemToString(item: IOptionNode | null) {
      return item ? item.props.name : ''
    }

    const {
      isOpen,
      selectedItem,
      getToggleButtonProps,
      getLabelProps,
      getMenuProps,
      highlightedIndex,
      getItemProps,
    } = useSelect({
      items: cellOptions,
      itemToString,
      onSelectedItemChange(changes) {
        updateCell(changes.selectedItem?.id)
      },
    })

    const currentOption = selectedItem ?? option

    console.log('selectedItem:', selectedItem, option)

    return (
      <Box w-100p>
        <Box
          h-100p
          w-100p
          p2
          cursorPointer
          outlineNone
          {...getToggleButtonProps()}
        >
          <Box
            inlineFlex
            roundedFull
            px2
            py1
            textSM
            color={currentOption?.props.color}
            bg--T90={currentOption?.props.color}
          >
            {currentOption ? currentOption.props.name : ''}
          </Box>
        </Box>
        <Box
          absolute
          w-200
          bgWhite
          mt1
          shadowPopover
          maxH-300
          overflowScroll
          p0
          zIndex-10
          roundedLG
          hidden={!isOpen}
          {...getMenuProps()}
        >
          <Input
            placeholder="Find or create option"
            size="sm"
            variant="unstyled"
            px2
            borderBottom
            roundedNone
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              e.stopPropagation()
              if (e.key === 'Enter') {
                addOption(cell.props.columnId, q)
              }
            }}
          />
          <Box p1>
            {!cellOptions.length && (
              <Box gray400 textSM>
                No options
              </Box>
            )}
            {isOpen && !!cellOptions.length && (
              <Box column gap-1>
                {cellOptions.map((item, index) => (
                  <Box
                    bgNeutral100={highlightedIndex === index}
                    bgNeutral100--T10={selectedItem === item}
                    cursorPointer
                    py-6
                    px2
                    rounded
                    key={item.id}
                    {...getItemProps({ item, index })}
                  >
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
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    )
  },
)
