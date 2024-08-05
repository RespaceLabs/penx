'use client'

import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { Space } from '@prisma/client'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { Copy } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'

interface Props {
  space: Space
}

export function CurationCard({ space }: Props) {
  const pathname = usePathname()
  const { address = '', isConnected } = useAccount()
  const { open } = useWeb3Modal()
  const { copy } = useCopyToClipboard()
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}${pathname}?curator=${
    address || 'xxx...'
  }`

  return (
    <div className="flex flex-col text-neutral-600 text-sm border border-slate-200/60 rounded-2xl p-4">
      <div className="font-semibold text-neutral-900">
        Get rewards as Curator
      </div>
      <div>
        Copy your unique link below, share it and earn a reward when someone buy
        space/post keys.
      </div>
      <div className="flex items-center justify-between gap-2 w-full mt-2 relative">
        <div className="text-base relative flex-1 overflow-hidden truncate w-1 bg-muted px-2 py-1 rounded-lg">
          {url}
        </div>
        <Copy
          size={20}
          className="cursor-pointer text-neutral-600 hover:text-neutral-800"
          onClick={() => {
            if (!isConnected) return open()
            copy(url)
            toast.success('Link copied to clipboard!')
          }}
        />
      </div>
    </div>
  )
}
