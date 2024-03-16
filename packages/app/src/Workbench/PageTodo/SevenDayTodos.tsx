import { useEffect, useState } from 'react'
import { Box } from '@fower/react'
import { store, TodoRecord } from '@penx/store'
import { useTodoFilter } from './hooks/useTodoFilter'
import { TodoItem } from './TodoItem'

export const SevenDayTodos = () => {
  return (
    <Box column mt4>
      7 Day...
    </Box>
  )
}
