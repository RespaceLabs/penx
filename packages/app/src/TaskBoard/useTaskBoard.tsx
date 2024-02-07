import { useCallback, useEffect, useState } from 'react'
import { type GridColumn } from '@glideapps/glide-data-grid'
import { Task } from '@penx/db'
import { FieldType } from '@penx/model-types'
import { api } from '@penx/trpc-client'

interface IColumns {
  title: string
  id: string
  hasMenu?: boolean
  dataType?: FieldType
  width?: number | string
}

interface TaskOptions {
  id: string
  name: string
  color: string
}

const excludeProperty = ['id', 'userId', 'createdAt', 'updatedAt']

export const taskTypeMap: Record<
  string,
  { title: string; type: FieldType; width?: number; options?: TaskOptions[] }
> = {
  title: {
    title: 'title',
    type: FieldType.TEXT,
    width: 150,
  },
  status: {
    title: 'status',
    type: FieldType.SINGLE_SELECT,
    options: [
      {
        id: '1',
        name: 'Available',
        color: 'yellow500',
      },
      {
        id: '2',
        name: 'Doing',
        color: 'sky500',
      },
      {
        id: '3',
        name: 'Reviewing',
        color: 'purple500',
      },
      {
        id: '4',
        name: 'Completed',
        color: 'green500',
      },
    ],
    width: 80,
  },
  description: {
    title: 'description',
    type: FieldType.MARKDOWN,
    width: 150,
  },
  tags: {
    title: 'tags',
    type: FieldType.MULTIPLE_SELECT,
    options: [
      {
        id: '1',
        name: 'Slate.js',
        color: 'yellow500',
      },
      {
        id: '2',
        name: 'Rust',
        color: 'sky500',
      },
      {
        id: '3',
        name: 'Backend',
        color: 'sky500',
      },
    ],
    width: 160,
  },
  figmaUrl: {
    title: 'Figma URL',
    type: FieldType.URL,
    width: 150,
  },
  issueUrl: {
    title: 'Issue URL',
    type: FieldType.URL,
    width: 150,
  },

  prUrl: {
    title: 'PR URL',
    type: FieldType.URL,
    width: 150,
  },
  usdReward: {
    title: 'USD reward',
    type: FieldType.NUMBER,
  },
  tokenReward: {
    title: 'Token reward',
    type: FieldType.NUMBER,
  },
  claimStage: {
    title: 'Claim stage',
    type: FieldType.SINGLE_SELECT,
    options: [
      {
        id: '1',
        name: 'Pending',
        color: 'yellow500',
      },
      {
        id: '2',
        name: 'Claimable',
        color: 'sky500',
      },
    ],
    width: 80,
  },
}

export const useTaskBoard = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [columns, setColumns] = useState<IColumns[]>([])

  const fetchTasks = useCallback(async (): Promise<Task[]> => {
    const data = await api.task.all.query()
    setTasks(data)

    return data
  }, [])

  const generateColumns = useCallback((tasks: Task[]) => {
    if (tasks.length) {
      const columns = []
      const task = tasks[0]
      for (const key in task) {
        if (task.hasOwnProperty(key) && !excludeProperty.includes(key)) {
          columns.push({
            title: taskTypeMap[key].title || key,
            id: key,
            hasMenu: false,
            width: taskTypeMap[key].width || 'auto',
            dataType: taskTypeMap[key].type || FieldType.TEXT,
          })
        }
      }

      setColumns(columns)
    }
  }, [])

  const onColumnResize = useCallback((column: GridColumn, newSize: number) => {
    setColumns((preColumns) => {
      const index = preColumns.findIndex((ci) => ci.id === column.id)
      const newArray = [...preColumns]
      newArray.splice(index, 1, {
        ...preColumns[index],
        width: newSize,
      })

      return newArray
    })
  }, [])

  useEffect(() => {
    fetchTasks().then((data) => {
      generateColumns(data)
    })
  }, [])

  return {
    tasks,
    columns,
    setTasks,
    fetchTasks,
    onColumnResize,
  }
}
