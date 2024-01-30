import { useEffect, useState } from 'react'
import { Box } from '@fower/react'
import { Task } from '@penx/db'
import { api } from '@penx/trpc-client'
import { TaskBoardTable } from './TableView'

export function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    api.task.all.query().then((data) => {
      setTasks(data)
    })
  }, [])

  return (
    <Box p10 h="100%">
      <Box pb1>TaskBoard</Box>
      <TaskBoardTable tasks={tasks} setTasks={setTasks} />
    </Box>
  )
}
