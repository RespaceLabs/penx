import { useEffect, useState } from 'react'
import { Box } from '@fower/react'
import { store, TodoRecord } from '@penx/store'
import { TodoItem } from './TodoItem'

export const TodayTodos = () => {
  const [records, setRows] = useState<TodoRecord[]>([])
  useEffect(() => {
    const records = store.node.getTodos()
    setRows(records)
  }, [])

  const todayTodos = records.filter((record) => record.todoNode.isToday)

  return (
    <Box column mt4>
      {todayTodos.map((todo) => {
        const { row, todoNode } = todo
        return <TodoItem key={row.id} todo={todo} />
      })}
    </Box>
  )
}
