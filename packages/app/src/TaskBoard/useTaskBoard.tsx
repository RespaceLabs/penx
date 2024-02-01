import { useCallback, useEffect, useState } from 'react'
import { Task } from '@penx/db'
import { FieldType } from '@penx/model-types'
import { api } from '@penx/trpc-client'

interface IColumns {
  title: string
  id: string
  hasMenu?: boolean
  dataType?: FieldType
}

const excludeProperty = ['id', 'userId', 'createdAt', 'updatedAt']

const taskTypeMap: Record<string, { title: string; type: FieldType }> = {
  title: {
    title: 'title',
    type: FieldType.TEXT,
  },
  status: {
    title: 'status',
    type: FieldType.SINGLE_SELECT,
  },
  description: {
    title: 'description',
    type: FieldType.MARKDOWN,
  },
  tags: {
    title: 'tags',
    type: FieldType.MULTIPLE_SELECT,
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
  }
}
