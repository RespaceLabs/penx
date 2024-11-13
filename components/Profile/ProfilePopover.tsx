'use client'

import { memo } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { AuthType } from '@prisma/client'
import {
  DatabaseBackup,
  FileText,
  Gauge,
  KeySquare,
  LogOut,
  Settings,
  UserCog,
  UserRound,
  Wallet,
} from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useSiteContext } from '../SiteContext'
import { Skeleton } from '../ui/skeleton'
import { ProfileAvatar } from './ProfileAvatar'
import { WalletInfo } from './WalletInfo'

interface Props {
  className?: string
  showAddress?: boolean
  showEnsName?: boolean
  showDropIcon?: boolean
}

export const ProfilePopover = memo(function ProfilePopover({
  showAddress,
  showEnsName,
  showDropIcon = false,
  className = '',
}: Props) {
  const { data } = useSession()
  const { push } = useRouter()
  const { authType } = useSiteContext()
  const isGoogleOauth = authType === AuthType.GOOGLE

  if (!data) return <div></div>
  const isEditor = ['ADMIN', 'AUTHOR'].includes(data.role)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ProfileAvatar
          showAddress={showAddress}
          showEnsName={showEnsName}
          showDropIcon={showDropIcon}
          image={data.user?.image || ''}
          className={cn('cursor-pointer', className)}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="grid gap-2">
          {isGoogleOauth && (
            <div>
              <div>{data.user?.name || data.user?.email}</div>
            </div>
          )}

          {!isGoogleOauth && (
            <>
              <ProfileAvatar showAddress showEnsName showCopy />
              <WalletInfo />
            </>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              push('/wallet')
            }}
          >
            <Wallet className="mr-2 h-4 w-4" />
            <span>Wallet</span>
          </DropdownMenuItem>

          {isEditor && (
            <>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  push('/~/objects/today')
                }}
              >
                <Gauge className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  push('/~/settings')
                }}
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>

              {/* <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  push('/~/access-token')
                }}
              >
                <KeySquare className="mr-2 h-4 w-4" />
                <span>Access Token</span>
              </DropdownMenuItem> */}
            </>
          )}
        </DropdownMenuGroup>
        {isEditor && <DropdownMenuSeparator />}
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={async () => {
            try {
              await signOut()
              push('/')
            } catch (error) {}
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
})
