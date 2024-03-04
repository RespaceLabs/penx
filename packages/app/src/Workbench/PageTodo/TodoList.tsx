import { useEffect, useState } from 'react'
import { Box } from '@fower/react'
import { store, TodoRecord } from '@penx/store'
import { TodoItem } from './TodoItem'

export const TodoList = () => {
  const [records, setRows] = useState<TodoRecord[]>([])
  useEffect(() => {
    const records = store.node.getTodos()
    setRows(records)
  }, [])

  return (
    <Box column mt4>
      {records.map((todo) => {
        const { row, todoNode } = todo
        return <TodoItem key={row.id} todo={todo} />
      })}
    </Box>
  )
}
