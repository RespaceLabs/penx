'use client'

import { useMemberDialog } from '@/components/MemberDialog/useMemberDialog'
import { Button } from '@/components/ui/button'
import { WalletConnectButton } from '@/components/WalletConnectButton'
import { useMembers } from '@/hooks/useMembers'
import { useSpace } from '@/hooks/useSpace'
import { useSession } from 'next-auth/react'
import { useAccount } from 'wagmi'

interface Props {}

export function MemberButton({}: Props) {
  const { isConnected } = useAccount()

  if (!isConnected)
    return <WalletConnectButton>Become a member</WalletConnectButton>
  return <ConnectedButton></ConnectedButton>
}

export function ConnectedButton() {
  const { setIsOpen } = useMemberDialog()
  const { data: session } = useSession()
  const { space } = useSpace()
  const { members } = useMembers(space?.id)
  const isMember = members?.some((m) => m.userId === session?.userId)

  return (
    <Button
      className="flex items-center gap-2 rounded-2xl"
      onClick={() => {
        setIsOpen(true)
      }}
    >
      {isMember && <div>Update subscription</div>}
      {!isMember && <div>Become a member</div>}
    </Button>
  )
}
