import React from 'react'
import { Text, Box } from 'ink'

type Props = {
  user?: any
}

export const LoginSuccess = ({ user }: Props) => {
  const name = user?.name || user?.username || user?.email || user?.address
  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      <Box paddingBottom={1}>
        <Text bold color="green">
          Hi, {name}, Login successfully~
        </Text>
      </Box>
    </Box>
  )
}
