import { useState } from 'react'
import { Box } from '@fower/react'
import { useAccount } from 'wagmi'
import { Button, Spinner, toast } from 'uikit'
import { useSpaces } from '@penx/hooks'
import { User } from '@penx/model'
import { store } from '@penx/store'
import { trpc } from '@penx/trpc-client'

interface Props {
  installationId: number
  repoName: string
}

export function GitHubConnectButton({ installationId, repoName }: Props) {
  const [loading, setLoading] = useState(false)
  const { address = '' } = useAccount()
  const { activeSpace } = useSpaces()

  async function connect() {
    setLoading(true)
    try {
      const user = await trpc.user.connectRepo.mutate({
        address,
        spaceId: activeSpace.id,
        installationId,
        repoName,
      })

      store.setUser(new User(user))
    } catch (error) {
      toast.warning('Connect GitHub failed')
    }
    setLoading(false)
  }

  return (
    <Button
      size="sm"
      colorScheme="black"
      disabled={loading}
      onClick={connect}
      gap2
    >
      {loading && <Spinner white square4 />}
      <Box>Connect</Box>
    </Button>
  )
}
