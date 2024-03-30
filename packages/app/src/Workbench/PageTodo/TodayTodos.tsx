import { Box } from '@fower/react'
import { useTodos } from '@penx/node-hooks'
import { TodoItem } from './TodoItem'

export const TodayTodos = () => {
  const { todos } = useTodos()
  const todayTodos = todos.filter((record) => record.todoNode.isToday)

  return (
    <Box column mt4>
      {todayTodos.map((todo) => {
        const { row, todoNode } = todo
        return <TodoItem key={row.id} todo={todo} />
      })}
    </Box>
  )
}
