'use client'

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
import { usePrivy } from '@privy-io/react-auth'
import {
  DatabaseBackup,
  Gauge,
  KeySquare,
  LogOut,
  Settings,
  UserCog,
  UserRound,
} from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useSiteContext } from '../SiteContext'
import { ProfileAvatar } from './ProfileAvatar'
import { WalletInfo } from './WalletInfo'

interface Props {
  className?: string
  showAddress?: boolean
  showEnsName?: boolean
}

export function ProfilePopover({
  showAddress,
  showEnsName,
  className = '',
}: Props) {
  const { data } = useSession()
  const { push } = useRouter()
  const { logout } = usePrivy()
  const { authType } = useSiteContext()
  const isGoogleOauth = authType === AuthType.GOOGLE

  if (!data) return null
  const isEditor = ['ADMIN', 'AUTHOR'].includes(data.role)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ProfileAvatar
          showAddress={showAddress}
          showEnsName={showEnsName}
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
          {isEditor && (
            <>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  push('/~/posts')
                }}
              >
                <Gauge className="mr-2 h-4 w-4" />
                <span>Posts</span>
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

              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  push('/~/role')
                }}
              >
                <UserCog className="mr-2 h-4 w-4" />
                <span>Role</span>
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

              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  push('/~/backup')
                }}
              >
                <DatabaseBackup className="mr-2 h-4 w-4" />
                <span>Backup</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuGroup>
        {isEditor && <DropdownMenuSeparator />}
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            if (authType === AuthType.PRIVY) {
              logout()
            }

            signOut()
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
