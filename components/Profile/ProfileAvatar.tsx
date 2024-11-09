'use client'

import { forwardRef, HTMLAttributes } from 'react'
import { useAddress } from '@/hooks/useAddress'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { trpc } from '@/lib/trpc'
import { cn } from '@/lib/utils'
import { ChevronDown, Copy } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { UserAvatar } from '../UserAvatar'

interface Props extends HTMLAttributes<HTMLDivElement> {
  className?: string
  showEnsName?: boolean
  showAddress?: boolean
  showDropIcon?: boolean
  image?: string
  showFullAddress?: boolean
  showCopy?: boolean
}

export const ProfileAvatar = forwardRef<HTMLDivElement, Props>(
  function ProfileAvatar(
    {
      className = '',
      showEnsName,
      showAddress,
      showFullAddress,
      showCopy,
      showDropIcon,
      image,
      ...rest
    },
    ref,
  ) {
    const address = useAddress()
    const { data: session } = useSession()
    const shortAddress = address.slice(0, 6) + '...' + address.slice(-4)
    const { data } = trpc.user.me.useQuery(undefined, {
      enabled: !!session,
    })
    const { copy } = useCopyToClipboard()
    const ensName = data?.name

    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-2', className)}
        {...rest}
      >
        <UserAvatar address={address} image={image} />
        {(showEnsName || showAddress) && (
          <>
            <div>
              {showEnsName && ensName && (
                <div className="text-base">{ensName}</div>
              )}
              {showAddress && address && (
                <div className="flex gap-2 items-center">
                  <div
                    className={cn(
                      'text-sm',
                      showEnsName && ensName && 'text-xs text-foreground/60',
                    )}
                  >
                    {shortAddress}
                  </div>
                  {showCopy && (
                    <Copy
                      size={14}
                      className="text-foreground/60 cursor-pointer hover:text-foreground/80"
                      onClick={() => {
                        copy(address)
                        toast.success('Address copied to clipboard')
                      }}
                    ></Copy>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {showDropIcon && <ChevronDown size={14} />}
      </div>
    )
  },
)
