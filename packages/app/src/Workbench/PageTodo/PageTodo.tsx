import { Box } from '@fower/react'
import { AddTodoForm } from './AddTodoForm'
import { AllTodos } from './AllTodos'
import { useTodoFilter } from './hooks/useTodoFilter'
import { SevenDayTodos } from './SevenDayTodos'
import { TodayTodos } from './TodayTodos'
import { TodoFilter } from './TodoFilter'

export const PageTodo = () => {
  const { isTody, isSevenDay, isAllTodos } = useTodoFilter()

  return (
    <Box px={[20, 20, 40]} py={[0, 0, 40]}>
      <Box w={['100%', 680]} mx-auto pb20 column gap3>
        <Box fontBold text4XL display={['none', 'none', 'block']}>
          My tasks
        </Box>
        <TodoFilter />
        {isTody && <TodayTodos />}
        {isSevenDay && <SevenDayTodos />}
        {isAllTodos && <AllTodos />}
      </Box>
      {isTody && <AddTodoForm></AddTodoForm>}
    </Box>
  )
}
