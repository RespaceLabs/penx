import { PropsWithChildren } from 'react'
import { Box } from '@fower/react'
import { useSession } from 'next-auth/react'
import { useHideLogoLoader } from '@penx/hooks'
import { EarlyAccessCode } from './EarlyAccessCode'

export function EarlyAccessCodeProvider({ children }: PropsWithChildren) {
  const { data } = useSession()

  useHideLogoLoader()

  if (process.env.NEXT_PUBLIC_IS_EARLY_STAGE !== 'true') {
    return <>{children}</>
  }

  if (!data?.earlyAccessCode) {
    return (
      <Box h-100vh toCenter>
        <EarlyAccessCode />
      </Box>
    )
  }

  return <>{children}</>
}
