import { useCallback, useEffect, useRef, useState } from 'react'
import { Box } from '@fower/react'
import DataEditor, {
  DataEditorProps,
  DataEditorRef,
  EditableGridCell,
  GridCell,
  GridCellKind,
  Item,
} from '@glideapps/glide-data-grid'
import { Task } from '@penx/db'
import { api } from '@penx/trpc-client'

const defaultProps: Partial<DataEditorProps> = {
  smoothScrollX: true,
  smoothScrollY: true,
  getCellsForSelection: true,
  width: '100%',
  height: '100%',
}

interface IColumns {
  title: string
  id: string
  hasMenu?: boolean
  dataType?: 'Bubble' | 'Image' | 'DatePicker' | 'Number' | 'SingleDropdown'
}

interface TaskBoardTable {
  tasks: Task[]
  setTasks: (tasks: Task[]) => void
}

const excludeProperty = ['id', 'userId', 'createdAt', 'updatedAt']

export function TaskBoardTable({ tasks, setTasks }: TaskBoardTable) {
  const ref = useRef<DataEditorRef>(null)
  const [columns, setColumns] = useState<IColumns[]>([])

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
          return {
            kind: GridCellKind.Text,
            allowOverlay: true,
            readonly: false,
            displayData: target ? target.toString() : '',
            data: target ? target.toString() : '',
          }
        }
      } catch (error) {
        return {
          kind: GridCellKind.Text,
          allowOverlay: true,
          readonly: false,
          displayData: 'render row failed',
          data: error ? error.toString() : 'error msg',
        }
      }
    },
    [columns],
  )

  const onCellEdited = useCallback(
    async (cell: Item, newValue: EditableGridCell) => {
      if (newValue.kind !== GridCellKind.Text) {
        return
      }

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
          const column = {
            title: key,
            id: key,
            hasMenu: false,
          }

          columns.push(column)
        }
      }

      setColumns(columns)
    }
  }, [])

  useEffect(() => {
    generateColumns(tasks)
  }, [tasks])

  return (
    <Box h="100%">
      <DataEditor
        {...defaultProps}
        ref={ref}
        columns={columns}
        getCellContent={getContent}
        onCellEdited={onCellEdited}
        rowMarkers={'both'}
        rows={tasks.length}
      />
    </Box>
  )
}
