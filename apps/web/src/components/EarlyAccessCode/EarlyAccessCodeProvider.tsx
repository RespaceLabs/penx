import { PropsWithChildren } from 'react'
import { Box } from '@fower/react'
import { useSession } from 'next-auth/react'
import { EarlyAccessCode } from './EarlyAccessCode'

export function EarlyAccessCodeProvider({ children }: PropsWithChildren) {
  const { data } = useSession()

  if (!data?.earlyAccessCode) {
    return (
      <Box h-100vh toCenter>
        <EarlyAccessCode />
      </Box>
    )
  }

  return <>{children}</>
}
