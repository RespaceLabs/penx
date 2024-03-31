import { useRouter } from 'next/router'
import { Button } from 'uikit'
import { useSession } from '@penx/session'

export function LoginButton() {
  const { data, loading } = useSession()
  const { push } = useRouter()

  if (loading) return null
  if (data) return null

  return (
    <Button
      size="lg"
      roundedFull
      colorScheme="black"
      w-100p
      onClick={() => {
        push('/login/web3')
      }}
    >
      Login to enable Sync
    </Button>
  )
}
