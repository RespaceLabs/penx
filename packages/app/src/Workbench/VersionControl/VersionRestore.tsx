import { Box } from '@fower/react'
import { Spinner } from 'uikit'
import { useSession } from '@penx/session'
import { trpc } from '@penx/trpc-client'
import { CommitList } from './CommitList'

export function VersionRestore() {
  const { data } = useSession()
  const { data: token, isLoading } = trpc.github.getTokenByUserId.useQuery({
    userId: data.userId,
  })

  if (isLoading) {
    return (
      <Box>
        <Spinner></Spinner>
      </Box>
    )
  }

  if (!token) return null

  return (
    <Box>
      <CommitList token={token} />
    </Box>
  )
}
