import { Box } from '@fower/react'
import { useMotionValue, useTransform } from 'framer-motion'
import { Trash2 } from 'lucide-react'
import { useSlateStatic } from 'slate-react'
import { Popover, PopoverContent, PopoverTrigger } from 'uikit'
import { ElementProps } from '@penx/extension-typings'
import { CellNode } from '../nodes/CellNode'
import { TableNode } from '../nodes/TableNode'
import { useRowSortable } from '../rowSortable.store'
import { TableCellElement } from '../types'
import { IconInsertBottom } from './icons/IconInsertBottom'
import { IconInsertLeft } from './icons/IconInsertLeft'
import { IconInsertRight } from './icons/IconInsertRight'
import { IconInsertTop } from './icons/IconInsertTop'

export const TableCell = ({
  attributes,
  children,
  element,
}: ElementProps<TableCellElement>) => {
  const size = 8
  const editor = useSlateStatic()
  const cell = new CellNode(editor, element)

  const handlerProps = {
    square: size * 2,
    cursorPointer: true,
    roundedFull: true,
    bgYellow400: true,
    absolute: true,
    transparent: true,
    toCenter: true,
  }

  const {
    path,
    rowPath,
    isInFirstColumn,
    isInHeader,
    rowElement,
    tableElement,
  } = cell
  const { colWidths = [] } = tableElement
  const table = new TableNode(editor, tableElement)

  const colIndex = rowElement.children.findIndex(
    (child) => child.id === element.id,
  )

  const { rowSortable } = useRowSortable(rowElement.id)

  const x = useMotionValue(colWidths[colIndex] - 2)
  const width = useTransform(x, (value) => value + 2)

  /**
   * add new row
   * @param isNext is next row
   */
  const addRow = (isNext = false) => {
    const index = isNext
      ? rowPath[rowPath.length - 1] + 1
      : rowPath[rowPath.length - 1]
    table.addRow(index)
  }

  /**
   * add column is next column
   * @param isNext
   */
  const addColumn = (isNext = false) => {
    const cellPathLast = path[path.length - 1]
    const columnIndex = isNext ? cellPathLast + 1 : cellPathLast
    table.addColumn(columnIndex)
  }

  const removeRow = () => {
    table.removeRow(element)
  }

  const deleteColumn = () => {
    table.deleteColumn(element)
  }

  const colClassName = `table-${tableElement.id}-col-${colIndex}`

  return (
    <Box
      as="td"
      className={`${colClassName} tableCell`}
      border
      borderGray200
      px2
      py1
      relative
      breakAll
      minW-120
      bgGray100={isInHeader}
      fontSemibold={isInHeader}
      w={colWidths[colIndex]}
      style={{ verticalAlign: 'top' }}
      {...attributes}
      onClick={() => {}} // override default click
    >
      <Box
        className="tableCellHandler"
        // hidden
        {...handlerProps}
        top={-size}
        left={`calc(50% - ${size}px)`}
        opacity-0
        opacity-100--hover
        css={{ hidden: true }}
      >
        <Popover placement="top">
          <PopoverTrigger>
            <Box contentEditable={false}>&nbsp;</Box>
          </PopoverTrigger>
          <PopoverContent p3 toCenterY gap1>
            <IconInsertLeft onClick={() => addColumn()} />
            <IconInsertRight onClick={() => addColumn(true)} />
            <Trash2 size={20} onClick={() => deleteColumn()} />
          </PopoverContent>
        </Popover>
      </Box>

      {isInFirstColumn && (
        <Popover placement="top">
          <PopoverTrigger>
            <Box
              contentEditable={false}
              suppressContentEditableWarning
              selectNone
              {...handlerProps}
              left={-size}
              top={`calc(50% - ${size}px)`}
              opacity-0
              opacity-100--$tableRow--hover
              // opacity-100--$tableRow--i={rowSortable.isDragging}
            >
              <Box
                contentEditable={false}
                selectNone
                w-100p
                h-100p
                {...rowSortable.listeners}
              >
                &nbsp;
              </Box>
            </Box>
          </PopoverTrigger>
          <PopoverContent p3 toCenterY selectNone>
            <IconInsertTop onClick={() => addRow()} />
            <IconInsertBottom onClick={() => addRow(true)} />
            <Trash2 size={20} onClick={() => removeRow()} />
          </PopoverContent>
        </Popover>
      )}
      <Box>{children}</Box>
    </Box>
  )
}
