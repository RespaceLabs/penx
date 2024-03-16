import { useEffect, useState } from 'react'
import { Box } from '@fower/react'
import { store, TodoRecord } from '@penx/store'
import { useTodoFilter } from './hooks/useTodoFilter'
import { TodoItem } from './TodoItem'

export const AllTodos = () => {
  const { filter, setFilter } = useTodoFilter()
  const [records, setRows] = useState<TodoRecord[]>([])
  useEffect(() => {
    const records = store.node.getTodos()
    setRows(records)
  }, [])

  console.log('=======records:', records)

  return (
    <Box column mt4>
      {records.map((todo) => {
        const { row, todoNode } = todo
        return <TodoItem key={row.id} todo={todo} />
      })}
    </Box>
  )
}
