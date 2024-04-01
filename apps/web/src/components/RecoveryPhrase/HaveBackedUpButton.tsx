import { FC } from 'react'
import { Button, toast } from 'uikit'
import { useUser } from '@penx/hooks'
import { User } from '@penx/model'
import { store } from '@penx/store'
import { api } from '@penx/trpc-client'

interface Props {}

export const HaveBackedUpButton: FC<Props> = () => {
  const { user } = useUser()

  if (!user) return null

  async function updateStatus() {
    try {
      await api.user.updateMnemonicBackupStatus.mutate(true)
      store.user.setUser(
        new User({
          ...user.raw,
          isMnemonicBackedUp: true,
        }),
      )
    } catch (error) {
      toast.error('Failed to update backup status')
    }
  }

  return (
    <Button
      roundedFull
      disabled={user.isMnemonicBackedUp}
      onClick={() => updateStatus()}
    >
      I have backed up
    </Button>
  )
}
