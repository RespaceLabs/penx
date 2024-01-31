import { useCallback, useEffect, useRef, useState } from 'react'
import { Box, css } from '@fower/react'
import DataEditor, {
  CompactSelection,
  DataEditorProps,
  DataEditorRef,
  EditableGridCell,
  GridCell,
  GridCellKind,
  GridSelection,
  Item,
} from '@glideapps/glide-data-grid'
import { cellCommonRenderers } from '@penx/database/src/ui/views/TableView/cells-common'
import { SingleSelectCell } from '@penx/database/src/ui/views/TableView/cells-common/single-select-cell'
import { Task } from '@penx/db'
import { FieldType } from '@penx/model-types'
import { api } from '@penx/trpc-client'
import { useTaskBoard } from './useTaskBoard'

const defaultProps: Partial<DataEditorProps> = {
  smoothScrollX: true,
  smoothScrollY: true,
  getCellsForSelection: true,
  width: '100%',
  height: '100%',
}

const initialData = {
  userId: '',
  title: '',
  status: '',
  description: '',
  tags: '',
  figmaUrl: '',
  issueUrl: '',
  usdReward: 0,
  tokenReward: 0,
  claimStage: '',
} as Task

interface TaskOptions {
  id: string
  name: string
  color: string
}

const statusOptions: TaskOptions[] = [
  {
    id: '1',
    name: 'test3',
    color: 'yellow500',
  },
  {
    id: '2',
    name: 'test2',
    color: 'sky500',
  },
  {
    id: '3',
    name: 'test3',
    color: 'sky500',
  },
]

export function TaskBoardTable() {
  const { columns, tasks, setTasks, fetchTasks } = useTaskBoard()
  const ref = useRef<DataEditorRef>(null)
  const [numRows, setNumRows] = useState<number>(0)
  const [selection, setSelection] = useState<GridSelection>({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const onSelection = (gridSelection: GridSelection) => {
    setSelection(gridSelection)
  }

  const getContent = useCallback(
    (cell: Item): GridCell => {
      try {
        const [col, row] = cell
        const rowData = tasks[row]
        const colData = columns[col]
        const cellData = rowData[colData.id as keyof Task]
        if (typeof cellData === 'object') {
          const data = JSON.stringify(cellData)
          return {
            kind: GridCellKind.Text,
            allowOverlay: true,
            readonly: false,
            displayData: data,
            data,
          }
        } else {
          switch (colData.dataType) {
            case FieldType.NUMBER:
              return {
                kind: GridCellKind.Number,
                allowOverlay: true,
                readonly: false,
                displayData: cellData.toString(),
                data: Number(cellData),
              }

            case FieldType.SINGLE_SELECT:
              const ids: string[] = JSON.parse(cellData as string)
              const cellOptions = ids.map(
                (id) => statusOptions.find((o) => o.id === id)!,
              )

              return {
                kind: GridCellKind.Custom,
                allowOverlay: true,
                data: {
                  kind: 'single-select-cell',
                  options: cellOptions,
                  data: ids,
                  dataSource: statusOptions,
                },
              } as SingleSelectCell

            default:
              return {
                kind: GridCellKind.Text,
                allowOverlay: true,
                readonly: false,
                displayData: cellData ? cellData.toString() : '',
                data: cellData ? cellData.toString() : '',
              }
          }
        }
      } catch (error) {
        return {
          kind: GridCellKind.Text,
          allowOverlay: true,
          readonly: false,
          displayData: '',
          data: error ? error.toString() : 'error msg',
        }
      }
    },
    [tasks],
  )

  const onCellEdited = useCallback(
    async (cell: Item, newValue: EditableGridCell) => {
      const targetTask = tasks[cell[1]]
      const property = columns[cell[0]].id as keyof Task
      const task = { ...targetTask, [property]: newValue.data }

      tasks[cell[1]] = task
      setTasks([...tasks])
      try {
        await api.task.update.mutate({
          id: task.id,
          title: task.title,
          status: task.status,
          description: task.description?.toString() || '',
          tags: task.tags?.toString() || '',
          figmaUrl: task.figmaUrl?.toString() || '',
          issueUrl: task.issueUrl?.toString() || '',
          usdReward: Number(task.usdReward),
          tokenReward: Number(task.tokenReward),
          claimStage: task.claimStage,
        })
      } catch (error) {
        console.error('modify error:', error)
        tasks[cell[1]] = targetTask
        setTasks([...tasks])
      }

      return true
    },
    [tasks],
  )

  const onRowAppended = useCallback(async () => {
    await api.task.create.mutate(initialData as any)
    await fetchTasks()
    ref.current?.appendRow(0, true)
  }, [ref])

  const onDeleteRow = useCallback(async () => {
    const { rows } = selection
    const selectedRows: number[] = rows.toArray()
    if (!selectedRows.length) {
      return
    }

    for (const row of selectedRows) {
      await api.task.deleteById.mutate(tasks[row].id)
    }

    setSelection({
      columns: CompactSelection.empty(),
      rows: CompactSelection.empty(),
    })

    await fetchTasks()
  }, [selection])

  useEffect(() => {
    setNumRows(tasks.length)
  }, [tasks])

  return (
    <Box h="100%">
      <Box flex pb1>
        <h4>Task board</h4>
        <Box as="button" cursor="pointer" ml5 onClick={onRowAppended}>
          Append
        </Box>

        <Box as="button" cursor="pointer" ml5 onClick={onDeleteRow}>
          Delete row
        </Box>
      </Box>

      <DataEditor
        {...defaultProps}
        className={css('roundedXL shadowPopover')}
        rowSelect="single"
        rowSelectionMode="auto"
        rowMarkers="both"
        ref={ref}
        gridSelection={selection}
        columns={columns}
        rows={numRows}
        getCellContent={getContent}
        onCellEdited={onCellEdited}
        onGridSelectionChange={onSelection}
        customRenderers={cellCommonRenderers}
        // onRowAppended={onRowAppended}
      />
    </Box>
  )
}
