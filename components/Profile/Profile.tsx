'use client'

import { useSession } from 'next-auth/react'
import { useAccount } from 'wagmi'
import LoginButton from '../LoginButton'
import { useSiteContext } from '../SiteContext'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { ProfileDialog } from './ProfileDialog/ProfileDialog'
import { ProfilePopover } from './ProfilePopover'

interface Props {}

export function Profile({}: Props) {
  const { data, status } = useSession()
  const { address = '' } = useAccount()
  const site = useSiteContext()

  if (status === 'loading')
    return (
      <Avatar className="h-8 w-8">
        <AvatarFallback></AvatarFallback>
      </Avatar>
    )

  const authenticated = !!data

  return (
    <>
      <ProfileDialog />
      {!authenticated && <LoginButton />}
      {authenticated && <ProfilePopover />}
    </>
  )
}
