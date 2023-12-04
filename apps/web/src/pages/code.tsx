import React from 'react'
import { Box } from '@fower/react'
import { Button } from 'uikit'
import { api } from '~/utils/api'

const PageCode = () => {
  const { isLoading, mutate } = api.spaceInvitationCode.generate.useMutation()
  return (
    <Box p10 toCenter column minH-80 gap4>
      <Box>Code</Box>
      <Button disabled={isLoading} onClick={() => mutate()}>
        Generate
      </Button>
    </Box>
  )
}

export default PageCode
