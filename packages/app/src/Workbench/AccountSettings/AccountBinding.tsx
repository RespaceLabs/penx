import { useEffect } from 'react'
import { Box } from '@fower/react'
import { Button } from 'uikit'
import { useUser } from '@penx/hooks'
import { useSession } from '@penx/session'
import { api, trpc } from '@penx/trpc-client'
import { Title } from './Title'

export function AccountBinding() {
  const user = useUser()
  const { data } = useSession()
  console.log('=======user:', user, 'data:', data)

  return (
    <Box>
      <Title text="ACCOUNT BINDING" />
      <Box>
        <Box toCenterY toBetween></Box>
      </Box>
    </Box>
  )
}
