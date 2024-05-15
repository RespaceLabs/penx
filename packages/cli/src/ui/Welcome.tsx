import React from 'react'
import { Text, Box } from 'ink'

export const Welcome = () => {
  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      <Box paddingBottom={1}>
        <Text bold>Welcome to PenX CLI ~</Text>
      </Box>
    </Box>
  )
}
