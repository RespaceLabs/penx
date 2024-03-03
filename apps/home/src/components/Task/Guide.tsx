import { Box } from '@fower/react'

export function Guide() {
  return (
    <Box column gap2 gray900>
      <Box textXL fontSemibold>
        How to earn rewards?
      </Box>
      <Box gray500 leadingNormal textSM>
        <Box>1. Bind you GitHub Account.</Box>
        <Box>2. Find a task you interested, and go to the related issue. </Box>
        <Box>3. In the issue, comment /attempt to notify everyone.</Box>
        <Box>4. If you are assigned, you can start this task.</Box>
        <Box>
          5. After finishing the development, create a PR to develop branch.
        </Box>

        <Box>5. If the PR is merged, you can claim rewards in this page.</Box>
      </Box>
    </Box>
  )
}
