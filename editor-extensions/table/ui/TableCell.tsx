import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ElementProps } from '@/lib/extension-typings'
import { cn } from '@/lib/utils'
import { useMotionValue, useTransform } from 'framer-motion'
import { Trash2 } from 'lucide-react'
import { useSlateStatic } from 'slate-react'
import { CellNode } from '../nodes/CellNode'
import { TableNode } from '../nodes/TableNode'
import { useRowSortable } from '../rowSortable.store'
import { TableCellElement } from '../types'

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
    <td
      className={cn(
        'tableCell border border-foreground/15 px-2 py-1 relative break-all min-w-[120px]',
        isInHeader && 'bg-foreground/5',
        isInHeader && 'font-semibold',
        colClassName,
      )}
      style={{
        width: colWidths[colIndex],
        verticalAlign: 'top',
      }}
      {...attributes}
      onClick={() => {}} // override default click
    >
      <div
        {...handlerProps}
        className={cn('tableCellHandler hidden opacity-0 hover:opacity-100')}
        style={{
          left: `calc(50% - ${size}px)`,
          top: -size,
        }}
      >
        <Popover>
          <PopoverTrigger>
            <div contentEditable={false}>&nbsp;</div>
          </PopoverTrigger>
          <PopoverContent>
            {/* <IconInsertLeft onClick={() => addColumn()} /> */}
            {/* <IconInsertRight onClick={() => addColumn(true)} /> */}
            <Trash2 size={20} onClick={() => deleteColumn()} />
          </PopoverContent>
        </Popover>
      </div>

      {isInFirstColumn && (
        <Popover>
          <PopoverTrigger>
            <div
              contentEditable={false}
              suppressContentEditableWarning
              {...handlerProps}
              className="select-none opacity-0 "
              // opacity-100--$tableRow--hover
              style={{
                left: -size,
                top: `calc(50% - ${size}px)`,
              }}
            >
              <div
                contentEditable={false}
                className="select-none w-full h-full"
                {...rowSortable.listeners}
              >
                &nbsp;
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent className="p-3 flex items-center select-none">
            {/* <IconInsertTop onClick={() => addRow()} /> */}
            {/* <IconInsertBottom onClick={() => addRow(true)} /> */}
            <Trash2 size={20} onClick={() => removeRow()} />
          </PopoverContent>
        </Popover>
      )}
      <div>{children}</div>
    </td>
  )
}
