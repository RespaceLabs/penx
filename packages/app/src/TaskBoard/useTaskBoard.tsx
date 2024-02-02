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
  width?: number
}

interface TaskOptions {
  id: string
  name: string
  color: string
}

const excludeProperty = ['id', 'userId', 'createdAt', 'updatedAt']

export const taskTypeMap: Record<
  string,
  { title: string; type: FieldType; options?: TaskOptions[] }
> = {
  title: {
    title: 'title',
    type: FieldType.TEXT,
  },
  status: {
    title: 'status',
    type: FieldType.SINGLE_SELECT,
    options: [
      {
        id: '1',
        name: 'status1',
        color: 'yellow500',
      },
      {
        id: '2',
        name: 'status2',
        color: 'sky500',
      },
      {
        id: '3',
        name: 'status3',
        color: 'sky500',
      },
    ],
  },
  description: {
    title: 'description',
    type: FieldType.MARKDOWN,
  },
  tags: {
    title: 'tags',
    type: FieldType.MULTIPLE_SELECT,
    options: [
      {
        id: '1',
        name: 'tags1',
        color: 'yellow500',
      },
      {
        id: '2',
        name: 'tags2',
        color: 'sky500',
      },
      {
        id: '3',
        name: 'tags3',
        color: 'sky500',
      },
    ],
  },
  figmaUrl: {
    title: 'figma url',
    type: FieldType.URL,
  },
  issueUrl: {
    title: 'issue url',
    type: FieldType.URL,
  },
  usdReward: {
    title: 'usd reward',
    type: FieldType.NUMBER,
  },
  tokenReward: {
    title: 'token reward',
    type: FieldType.NUMBER,
  },
  claimStage: {
    title: 'claim stage',
    type: FieldType.SINGLE_SELECT,
    options: [
      {
        id: '1',
        name: 'claim1',
        color: 'yellow500',
      },
      {
        id: '2',
        name: 'claim2',
        color: 'sky500',
      },
      {
        id: '3',
        name: 'claim3',
        color: 'sky500',
      },
    ],
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
