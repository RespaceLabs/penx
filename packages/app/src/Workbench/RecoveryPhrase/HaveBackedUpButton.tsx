import { FC } from 'react'
import { Box } from '@fower/react'
import { Button, Spinner, toast } from 'uikit'
import { useUser } from '@penx/hooks'
import { User } from '@penx/model'
import { setAuthorizedUser } from '@penx/storage'
import { store } from '@penx/store'
import { trpc } from '@penx/trpc-client'

interface Props {}

export const HaveBackedUpButton: FC<Props> = () => {
  const { user } = useUser()
  const { isLoading, mutateAsync } =
    trpc.user.updateMnemonicBackupStatus.useMutation()

  if (!user) return null

  async function updateStatus() {
    try {
      mutateAsync(true)
      const newUser = {
        ...user.raw,
        isMnemonicBackedUp: true,
      }
      store.user.setUser(new User(newUser))
      await setAuthorizedUser(newUser)
    } catch (error) {
      toast.error('Failed to update backup status')
    }
  }

  return (
    <Button
      roundedFull
      colorScheme="white"
      disabled={user.isMnemonicBackedUp || isLoading}
      onClick={() => updateStatus()}
    >
      {isLoading && <Spinner />}

      <Box>I have backed up</Box>
    </Button>
  )
}
