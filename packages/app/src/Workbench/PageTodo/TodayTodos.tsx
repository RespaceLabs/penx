import { Box } from '@fower/react'
import { useTodos } from '@penx/node-hooks'
import { TodoItem } from './TodoItem'

export const TodayTodos = () => {
  const { todos } = useTodos()
  console.log('=======todos:', todos)

  const todayTodos = todos.filter((record) => record.todoNode.isToday)

  if (!todayTodos.length) {
    return (
      <Box h-80vh toCenter>
        <Box text4XL fontBold textCenter leadingNone>
          What{"'"}s your plain for today?
        </Box>
      </Box>
    )
  }
  return (
    <Box column mt={[4, 4, 12]}>
      {todayTodos.map((todo) => {
        const { row, todoNode } = todo
        return <TodoItem key={row.id} todo={todo} />
      })}
    </Box>
  )
}
