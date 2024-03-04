import { Box } from '@fower/react'
import { useUser } from '@penx/hooks'
import { AddTodoForm } from './AddTodoForm'
import { TodoFilter } from './TodoFilter'
import { TodoList } from './TodoList'

export const PageTodo = () => {
  const user = useUser()

  return (
    <Box p10>
      <Box w={['100%', 680]} mx-auto pb20 column gap3>
        <Box fontBold text4XL>
          Good Morning, {user.username}.
        </Box>
        <TodoFilter />
        <TodoList />
      </Box>
      <AddTodoForm></AddTodoForm>
    </Box>
  )
}
