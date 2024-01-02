import { useCallback, useEffect, useState } from 'react'
import isEqual from 'react-fast-compare'
import {
  EditableGridCell,
  GridCell,
  GridCellKind,
  GridColumn,
  GridColumnIcon,
  Item,
  Rectangle,
} from '@glideapps/glide-data-grid'
import { format } from 'date-fns'
import { produce } from 'immer'
import { db } from '@penx/local-db'
import {
  FieldType,
  ICellNode,
  IColumnNode,
  IOptionNode,
  ViewColumn,
} from '@penx/model-types'
import { mappedByKey } from '@penx/shared'
import { store } from '@penx/store'
import { useDatabaseContext } from '../../DatabaseContext'
import { DateCell } from './cells/date-cell'
import { MultipleSelectCell } from './cells/multiple-select-cell'
import { NoteCell } from './cells/note-cell'
import { PasswordCell } from './cells/password-cell'
import { RateCell } from './cells/rate-cell'
import { SingleSelectCell } from './cells/single-select-cell'
import { SystemDateCell } from './cells/system-date-cell'

function getCols(columns: IColumnNode[], viewColumns: ViewColumn[]) {
  const sortedColumns = viewColumns
    .map(({ columnId }) => {
      return columns.find((col) => col.id === columnId)!
    })
    .filter((col) => !!col)

  const viewColumnsMapped = mappedByKey(viewColumns, 'columnId')

  const cols: GridColumn[] = sortedColumns.map((col) => {
    function getIcon() {
      if (col.props.fieldType === FieldType.NUMBER) {
        return GridColumnIcon.HeaderNumber
      }
      return GridColumnIcon.HeaderString
    }

    const viewColumn = viewColumnsMapped[col.id]

    return {
      id: col.id,
      title: col.props.name,
      width: viewColumn?.width ?? 160,
      icon: getIcon(),
      hasMenu: true,
      themeOverride: {
        // bgHeader: ''
      },
    }
  })
  return cols
}

export function useTableView() {
  const {
    columns,
    rows,
    cells,
    currentView,
    sortedColumns,
    deleteColumn,
    options,
  } = useDatabaseContext()
  let { viewColumns = [] } = currentView.props

  const data = rows.map((row, i) => {
    return columns.reduce(
      (acc, col) => {
        // need to improvement performance
        const cell = cells.find(
          (c) => c.props.columnId === col.id && c.props.rowId === row.id,
        )!

        let data: any = cell.props.data ?? ''
        return { ...acc, [col.id]: cell }
      },
      {} as Record<string, ICellNode>,
    )
  })

  const columnsMap = mappedByKey(columns, 'id')

  const getContent = useCallback(
    (cell: Item): GridCell => {
      const [col, row] = cell
      const dataRow = data[row]

      const indexes: string[] = viewColumns.map((c) => c.columnId)
      const cellNode = dataRow[indexes[col]]
      const columnNode = columnsMap[indexes[col]]
      const rowNode = rows[row]

      // console.log('==getContent-test: cell:',cell, { data,dataRow,rows,cellNode },'BB:',{columnsMap,indexes,columnNode })

      let cellData: any = cellNode.props.data ?? ''

      function getKind(): any {
        const maps: Record<any, GridCellKind> = {
          [FieldType.NUMBER]: GridCellKind.Number,
          [FieldType.URL]: GridCellKind.Uri,
          [FieldType.MARKDOWN]: GridCellKind.Markdown,
        }

        return maps[columnNode.props.fieldType] || GridCellKind.Text
      }

      if (columnNode.props.fieldType === FieldType.DATE) {
        return {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData: cellData
            ? format(new Date(cellData), 'yyyy-MM-dd HH:mm:ss')
            : '',
          themeOverride: {
            //
          },
          data: {
            kind: 'date-cell',
            data: cellNode.props.data,
          },
        } as DateCell
      }

      if (columnNode.props.fieldType === FieldType.RATE) {
        return {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData: cellNode.props.data,
          data: {
            kind: 'rate-cell',
            data: cellNode.props.data,
          },
        } as RateCell
      }

      if (columnNode.props.fieldType === FieldType.PASSWORD) {
        return {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData: cellNode.props.data,
          data: {
            kind: 'password-cell',
            data: cellNode.props.data,
          },
        } as PasswordCell
      }

      if (
        [FieldType.SINGLE_SELECT, FieldType.MULTIPLE_SELECT].includes(
          columnNode.props.fieldType,
        )
      ) {
        const ids: string[] = Array.isArray(cellNode.props.data)
          ? cellNode.props.data
          : []

        const cellOptions = ids.map((id) => options.find((o) => o.id === id)!)

        return {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData: cellOptions.map((o) => o.props.name).join(','),
          data: {
            kind:
              FieldType.SINGLE_SELECT === columnNode.props.fieldType
                ? 'single-select-cell'
                : 'multiple-select-cell',
            column: columnNode,
            options: cellOptions,
            data: cellOptions.map((o) => o.id),
          },
        } as SingleSelectCell | MultipleSelectCell
      }

      if (
        [FieldType.CREATED_AT, FieldType.UPDATED_AT].includes(
          columnNode.props.fieldType,
        )
      ) {
        const isCreatedAt = FieldType.CREATED_AT === columnNode.props.fieldType
        return {
          kind: GridCellKind.Custom,
          allowOverlay: false,
          readonly: true,
          copyData: format(
            isCreatedAt ? rowNode.createdAt : rowNode.updatedAt,
            'yyyy-MM-dd HH:mm:ss',
          ),
          data: {
            kind: 'system-date-cell',
            data: rowNode,
            type: columnNode.props.fieldType,
          },
        } as SystemDateCell
      }

      if (col === 0) {
        return {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData: 'TODO',
          data: {
            kind: 'note-cell',
            data: cellNode,
            column: columnNode,
          },
        } as NoteCell
      }

      if (columnNode.props.fieldType === FieldType.NUMBER) {
        cellData = cellData?.toString()
      }

      return {
        kind: getKind(),
        allowOverlay: true,
        readonly: false,
        data: cellData,
        displayData: cellData,
      }
    },
    [data, rows, options, viewColumns, columnsMap],
  )

  const [cols, setCols] = useState(getCols(columns, viewColumns))

  useEffect(() => {
    const newCols = getCols(columns, viewColumns)
    if (!isEqual(cols, newCols)) {
      setCols(newCols)
    }
  }, [columns, viewColumns])

  const onCellEdited = useCallback(
    async ([colIndex, rowIndex]: Item, newValue: EditableGridCell) => {
      console.log('==========onCellEdited: newValue:', newValue)

      const row = rows[rowIndex]
      const column = sortedColumns[colIndex]

      // need to improvement performance
      const cell = cells.find(
        (c) => c.props.columnId === column.id && c.props.rowId === row.id,
      )!

      let data: any = newValue.data

      // for custom cells
      if (typeof data === 'object') {
        data = data.data
      }

      await db.updateCell(cell.id, {
        props: { ...cell.props, data },
      })

      const nodes = await db.listNodesBySpaceId(cell.spaceId)
      store.node.setNodes(nodes)
    },
    [cells, rows, sortedColumns],
  )

  function onColumnResize(
    column: GridColumn,
    newSize: number,
    colIndex: number,
    newSizeWithGrow: number,
  ) {
    const newCols = produce(cols, (draft) => {
      draft[colIndex] = { ...draft[colIndex], width: newSize }
    })

    setCols(newCols)
  }

  async function onColumnResizeEnd(
    column: GridColumn,
    newSize: number,
    colIndex: number,
    newSizeWithGrow: number,
  ) {
    await db.updateViewColumn(currentView.id, column.id!, {
      width: newSize,
    })
  }

  const onDeleteColumn = useCallback(
    async (columnId: string) => {
      const newCols = cols.filter((col) => col.id !== columnId)
      setCols(newCols)
      await deleteColumn(columnId)
    },
    [cols, deleteColumn],
  )

  return {
    cols: cols,
    getContent,
    onCellEdited,
    onColumnResize,
    onColumnResizeEnd,
    onDeleteColumn,
  }
}
