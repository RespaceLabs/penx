import { Box } from '@fower/react'
import { DisconnectButton, Logo } from '@penx/app'
import { TaskFilter } from './TaskFilter'
import { TaskList } from './TaskList'

export function TaskBox() {
  return (
    <Box maxW-1120 mx-auto p5 column>
      <Box toBetween toCenterY>
        <Logo />
        <DisconnectButton />
      </Box>
      <Box mt10>
        <TaskFilter />
      </Box>
      <TaskList />
    </Box>
  )
}
