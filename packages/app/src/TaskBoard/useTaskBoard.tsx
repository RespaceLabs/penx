import { useCallback, useEffect, useState } from 'react'
import { Task } from '@penx/db'
import { api } from '@penx/trpc-client'

export const useTaskBoard = () => {
  const [tasks, setTasks] = useState<Task[]>([])

  const fetchTasks = useCallback(async () => {
    api.task.all.query().then((data) => {
      setTasks(data)
    })
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [])

  return {
    tasks,
    setTasks,
    fetchTasks,
  }
}
