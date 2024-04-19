import { useCallback } from 'react'
import {
  GridCell,
  GridCellKind,
  GridColumn,
  GridColumnIcon,
  Item,
} from '@glideapps/glide-data-grid'
import { format } from 'date-fns'
import {
  FieldType,
  ICellNode,
  IColumnNode,
  IDatabaseNode,
  IOptionNode,
  IRowNode,
  IViewNode,
  ViewColumn,
  ViewType,
} from '@penx/model-types'
import { mappedByKey } from '@penx/shared'
import { MultipleSelectCell } from '../views/TableView/cells/multiple-select-cell'
import { PasswordCell } from '../views/TableView/cells/password-cell'
import { RateCell } from '../views/TableView/cells/rate-cell'
import { SingleSelectCell } from '../views/TableView/cells/single-select-cell'
import { SystemDateCell } from '../views/TableView/cells/system-date-cell'

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
      title: col.props.displayName,
      width: viewColumn?.width ?? 160,
      icon: getIcon(),
      themeOverride: {
        // bgHeader: ''
      },
    }
  })
  return cols
}

interface Params {
  database: IDatabaseNode
  views: IViewNode[]
  columns: IColumnNode[]
  rows: IRowNode[]
  cells: ICellNode[]
  options: IOptionNode[]
}

export function useReadonlyTableView(params: Params) {
  const { columns, views, rows, cells, options } = params

  const currentView = views.find((n) => n.props.viewType === ViewType.TABLE)!

  const columnsMap = mappedByKey(columns, 'id')
  let { viewColumns = [] } = currentView.props
  const cols = getCols(columns, viewColumns)

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

  const getContent = useCallback(
    (cell: Item): GridCell => {
      const [col, row] = cell
      const dataRow = data[row]

      const indexes: string[] = viewColumns.map((c) => c.columnId)
      const cellNode = dataRow[indexes[col]]
      const columnNode = columnsMap[indexes[col]]
      const rowNode = rows[row]
      let cellData: any = cellNode.props.data ?? ''

      function getKind(): any {
        const maps: Record<any, GridCellKind> = {
          [FieldType.NUMBER]: GridCellKind.Number,
          [FieldType.URL]: GridCellKind.Uri,
          [FieldType.MARKDOWN]: GridCellKind.Markdown,
          [FieldType.IMAGE]: GridCellKind.Image,
        }

        return maps[columnNode.props.fieldType] || GridCellKind.Text
      }

      if (columnNode.props.fieldType === FieldType.RATE) {
        return {
          kind: GridCellKind.Custom,
          allowOverlay: false,
          readonly: true,
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
          allowOverlay: false,
          readonly: true,
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
          allowOverlay: false,
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

      if (columnNode.props.fieldType === FieldType.NUMBER) {
        cellData = cellData?.toString()
      }

      if (columnNode.props.fieldType === FieldType.IMAGE) {
        cellData = Array.isArray(cellData) ? cellData : [cellData]
      }

      return {
        kind: getKind(),
        allowOverlay: false,
        readonly: false,
        data: cellData,
        displayData: cellData,
      }
    },
    [data, rows, options, viewColumns, columnsMap],
  )

  return {
    cols,
    getContent,
  }
}
