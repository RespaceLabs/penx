import React from 'react'
import { Box } from '@fower/react'
import { useSession } from 'next-auth/react'
import { SessionProvider } from '@penx/session'
import { MasterPassword } from '~/components/MasterPassword/MasterPassword'

const PagePassword = () => {
  const session = useSession()

  return (
    <SessionProvider
      value={{
        data: session.data as any,
        loading: session.status === 'loading',
      }}
    >
      <Box h-100vh toCenter>
        <MasterPassword></MasterPassword>
      </Box>
    </SessionProvider>
  )
}

export default PagePassword
