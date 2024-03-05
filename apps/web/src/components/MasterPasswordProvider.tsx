import { PropsWithChildren } from 'react'
import { Box } from '@fower/react'
import { useQuery } from '@tanstack/react-query'
import { get } from 'idb-keyval'
import { MASTER_PASSWORD } from '@penx/constants'
import { MasterPasswordLogin } from './MasterPasswordLogin/MasterPasswordLogin'

export function MasterPasswordProvider({ children }: PropsWithChildren) {
  const { data, isLoading, refetch } = useQuery(['masterPassword'], async () =>
    get(MASTER_PASSWORD),
  )

  if (isLoading) return null

  if (!data)
    return (
      <Box h-100vh toCenter>
        <MasterPasswordLogin refetch={refetch} />
      </Box>
    )

  return <>{children}</>
}
