'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import isEqual from 'react-fast-compare'
import { format } from 'date-fns'
import { produce } from 'immer'
import { DateCell } from '@/components/cells/date-cell'
import { FileCell, fileCellRenderer } from '@/components/cells/file-cell'
import {
  PasswordCell,
  passwordCellRenderer,
} from '@/components/cells/password-cell'
import { RateCell } from '@/components/cells/rate-cell'
import { SingleSelectCell } from '@/components/cells/single-select-cell'
import { SystemDateCell } from '@/components/cells/system-date-cell'
import { useDatabaseContext } from '@/components/database-ui/DatabaseProvider'
import { IColumnNode, IOptionNode, ViewColumn } from '@/lib/model'
import { queryClient } from '@/lib/queryClient'
import { mappedByKey } from '@/lib/shared'
import { api } from '@/lib/trpc'
import { FieldType, Option, ViewField } from '@/lib/types'
import { Field } from '@/server/db/schema'
import {
  DataEditorRef,
  EditableGridCell,
  GridCell,
  GridCellKind,
  GridColumn,
  GridColumnIcon,
  Item,
} from '@glideapps/glide-data-grid'

function getCols(fields: Field[], viewFields: ViewField[]) {
  const sortedFields = viewFields
    .filter((v) => v.visible)
    .map(({ fieldId }) => {
      return fields.find((col) => col.id === fieldId)!
    })
    .filter((col) => !!col)

  const viewFieldsMapped = mappedByKey(viewFields, 'fieldId')

  const cols: GridColumn[] = sortedFields.map((field) => {
    function getIcon() {
      if (field.fieldType === FieldType.NUMBER) {
        return GridColumnIcon.HeaderNumber
      }
      return GridColumnIcon.HeaderString
    }

    const viewField = viewFieldsMapped[field.id]

    return {
      id: field.id,
      title: field.displayName || '',
      width: viewField?.width ?? 160,
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
    database,
    filterResult: { filterRows = [], cellNodesMapList = [] },
    currentView,
    deleteField,
    sortedFields,

    // options,
    addRow,
    updateRowsIndexes,
  } = useDatabaseContext()
  const { fields, records, views } = database
  // console.log('========database:', database)

  const columnsMap = mappedByKey(fields, 'id')
  const rowsMap = mappedByKey(records, 'id')
  let { viewFields = [] } = currentView
  const [cols, setCols] = useState(getCols(fields, viewFields))

  const gridRef = useRef<DataEditorRef>(null)

  const getContent = useCallback(
    (cell: Item): GridCell => {
      const [col, row] = cell
      const field = columnsMap[currentView.viewFields[col].fieldId]
      const record = records[row]
      const fields = record.fields as Record<string, any>

      function getCellData() {
        if (!record) return ''
        let cellData: any = fields?.[field.id]
        if (!cellData) return ''

        if (field.fieldType === FieldType.NUMBER) {
          cellData = cellData?.toString()
        }

        return cellData
      }

      function getKind(): any {
        const maps: Record<any, GridCellKind> = {
          [FieldType.NUMBER]: GridCellKind.Number,
          [FieldType.URL]: GridCellKind.Uri,
          [FieldType.MARKDOWN]: GridCellKind.Markdown,
        }

        return maps[field.fieldType!] || GridCellKind.Text
      }
      const cellData = getCellData()

      if (field.fieldType === FieldType.DATE) {
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
            data: cellData,
          },
        } as DateCell
      }

      if (field.fieldType === FieldType.RATE) {
        return {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData: cellData,
          data: {
            kind: 'rate-cell',
            data: cellData,
          },
        } as RateCell
      }

      if (field.fieldType === FieldType.PASSWORD) {
        return {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData: cellData,
          data: {
            kind: 'password-cell',
            data: cellData,
          },
        } as PasswordCell
      }

      if (field.fieldType === FieldType.FILE) {
        return {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          readonly: true,
          copyData: '',
          data: {
            kind: 'file-cell',
            url: cellData,
            name: '',
          },
        } as FileCell
      }

      if (
        [FieldType.SINGLE_SELECT, FieldType.MULTIPLE_SELECT].includes(
          field.fieldType as any,
        )
      ) {
        // console.log('=====cellData:', cellData)

        const ids: string[] = Array.isArray(cellData) ? cellData : []
        // console.log('====>>>>>>:ids:', ids, 'cellData:', cellData)

        // console.log('===field:', field)

        const options = (field.options as Option[]) || []

        const cellOptions = ids
          .map((id) => options.find((o) => o.id === id)!)
          .filter((o) => !!o)
        // console.log('===cellOptions:', cellOptions)
        // console.log('=====options:', options, 'cellOptions:', cellOptions)

        return {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData: cellOptions.map((o) => o.name).join(','),
          data: {
            kind:
              FieldType.SINGLE_SELECT === field.fieldType
                ? 'single-select-cell'
                : 'multiple-select-cell',
            field: field,
            options: cellOptions,
            data: cellOptions.map((o) => o.id),
          },
        } as SingleSelectCell

        // } as SingleSelectCell | MultipleSelectCell
      }

      if (
        [FieldType.CREATED_AT, FieldType.UPDATED_AT].includes(
          field.fieldType as any,
        )
      ) {
        const isCreatedAt = FieldType.CREATED_AT === field.fieldType

        const date = isCreatedAt
          ? new Date(record.createdAt)
          : new Date(record.updatedAt)
        return {
          kind: GridCellKind.Custom,
          allowOverlay: false,
          readonly: true,
          copyData: format(date, 'yyyy-MM-dd HH:mm:ss'),
          data: {
            kind: 'system-date-cell',
            data: date,
          },
        } as SystemDateCell
      }

      return {
        kind: getKind(),
        allowOverlay: FieldType.NODE_ID !== field.fieldType,
        readonly: FieldType.NODE_ID === field.fieldType,
        data: cellData,
        displayData: cellData,
      }
    },
    [database, database.records, database.fields],
  )

  const setCellValue = async (
    [colIndex, rowIndex]: Item,
    newValue: EditableGridCell,
  ): Promise<void> => {
    const record = records[rowIndex]
    const field = sortedFields[colIndex]

    let data: any = newValue.data

    // for custom cells
    if (typeof data === 'object') {
      data = data.data
    }

    const newDatabase = produce(database, (draft) => {
      draft.records[rowIndex].fields = {
        ...(record.fields as any),
        [field.id]: data,
      }

      // hack for create option
      if (typeof newValue.data === 'object') {
        const newOption = (newValue?.data as any)?.newOption
        if (newOption) {
          for (const item of draft.fields) {
            if (item.id === field.id) {
              const options = (item.options as Option[]) || []
              item.options = [...options, newOption]
              break
            }
          }
        }
      }
    })

    queryClient.setQueriesData(
      { queryKey: ['database', record.databaseId] },
      newDatabase,
    )

    await api.database.updateRecord.mutate({
      recordId: record.id,
      fields: {
        ...(record.fields as any),
        [field.id]: data,
      },
    })
  }

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
    await api.database.updateViewField.mutate({
      viewId: currentView.id,
      fieldId: column.id!,
      width: newSize,
    })
  }

  const onDeleteField = useCallback(
    async (fieldId: string) => {
      const newCols = cols.filter((col) => col.id !== fieldId)
      setCols(newCols)
      await deleteField(fieldId)
    },
    [cols, deleteField],
  )

  const onRowAppended = useCallback(() => {
    addRow()
  }, [addRow])

  useEffect(() => {
    const newCols = getCols(fields, viewFields)
    // TODO: has bug when resize columns;
    if (!isEqual(cols, newCols)) {
      setCols(newCols)
    }
    // TODO: don't add cols to deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [database.fields, database.views])

  return {
    gridRef,
    records,
    // filterRows,
    // rowsNum: cellNodesMapList.length,
    sortedFields,
    rowsNum: records.length,
    cols,
    getContent,
    setCellValue,
    onColumnResize,
    onColumnResizeEnd,
    onDeleteField,
    onRowAppended,
  }
}
