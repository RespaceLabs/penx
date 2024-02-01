import { Box } from '@fower/react'
import { Guide } from './Guide'
import { TaskUserProfile } from './TaskUserProfile'

export function TaskHeader() {
  return (
    <Box mt10 gap2 bgGray100 rounded2XL p6 toBetween>
      <TaskUserProfile />
      <Guide />
    </Box>
  )
}
