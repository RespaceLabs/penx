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
import { Task } from '@penx/db'
import { FieldType } from '@penx/model-types'
import { api } from '@penx/trpc-client'
import { useTaskBoard } from './useTaskBoard'

interface IColumns {
  title: string
  id: string
  hasMenu?: boolean
  dataType?: FieldType
}

const excludeProperty = ['id', 'userId', 'createdAt', 'updatedAt']

const taskTypeMap: Record<string, FieldType> = {
  title: FieldType.TEXT,
  status: FieldType.SINGLE_SELECT,
  description: FieldType.MARKDOWN,
  tags: FieldType.MULTIPLE_SELECT,
  figmaUrl: FieldType.URL,
  issueUrl: FieldType.URL,
  usdReward: FieldType.NUMBER,
  tokenReward: FieldType.NUMBER,
  claimStage: FieldType.SINGLE_SELECT,
}

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

export function TaskBoardTable() {
  const { tasks, setTasks, fetchTasks } = useTaskBoard()
  const ref = useRef<DataEditorRef>(null)
  const [numRows, setNumRows] = useState<number>(0)
  const [columns, setColumns] = useState<IColumns[]>([])
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
        const target = rowData[colData.id as keyof Task]
        if (typeof target === 'object') {
          const data = JSON.stringify(target)
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
                displayData: target.toString(),
                data: Number(target),
              }
            default:
              return {
                kind: GridCellKind.Text,
                allowOverlay: true,
                readonly: false,
                displayData: target ? target.toString() : '',
                data: target ? target.toString() : '',
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
    [columns],
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
    [columns, tasks],
  )

  const generateColumns = useCallback((tasks: Task[]) => {
    if (tasks.length) {
      const columns = []
      const task = tasks[0]
      for (const key in task) {
        if (task.hasOwnProperty(key) && !excludeProperty.includes(key)) {
          columns.push({
            title: key,
            id: key,
            hasMenu: false,
            dataType: taskTypeMap[key] || FieldType.TEXT,
          })
        }
      }

      setColumns(columns)
    }
  }, [])

  const onRowAppended = useCallback(
    async (tasks: Task[]) => {
      await api.task.create.mutate(initialData as any)
      await fetchTasks()
      setTasks([...tasks, initialData])
    },
    [numRows],
  )

  const onAdd = useCallback(() => {
    ref.current?.appendRow(0, false)
    onRowAppended(tasks)
  }, [ref, tasks])

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
    generateColumns(tasks)
    setNumRows(tasks.length)
  }, [tasks])

  return (
    <Box h="100%">
      <Box flex pb1>
        <h4>Task board</h4>
        <Box as="button" cursor="pointer" ml5 onClick={onAdd}>
          Append
        </Box>

        <Box as="button" cursor="pointer" ml5 onClick={onDeleteRow}>
          delete row
        </Box>
      </Box>

      <DataEditor
        {...defaultProps}
        className={css('roundedXL shadowPopover')}
        rowSelect="single"
        rowSelectionMode="auto"
        gridSelection={selection}
        ref={ref}
        columns={columns}
        getCellContent={getContent}
        onCellEdited={onCellEdited}
        onGridSelectionChange={onSelection}
        rowMarkers={'both'}
        rows={numRows}
        // onRowAppended={onRowAppended}
      />
    </Box>
  )
}
