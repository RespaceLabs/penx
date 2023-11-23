import { useState } from 'react'
import { Box } from '@fower/react'
import { Button, Spinner, toast } from 'uikit'
import { useUser } from '@penx/hooks'
import { User } from '@penx/model'
import { store } from '@penx/store'
import { trpc } from '@penx/trpc-client'

interface Props {
  installationId: number
  repo: string
}

export function GitHubConnectButton({ installationId, repo }: Props) {
  const [loading, setLoading] = useState(false)
  const { id } = useUser()

  async function connect() {
    setLoading(true)
    try {
      const user = await trpc.user.connectRepo.mutate({
        userId: id,
        installationId,
        repo,
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
