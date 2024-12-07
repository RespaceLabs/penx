'use client'

import { IconGoogle } from '@/components/icons/IconGoogle'
import { useMyAccounts } from '@/hooks/useMyAccounts'
import { ProviderType } from '@prisma/client'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function LinkGoogleEntry() {
  const { data: accounts = [], isLoading } = useMyAccounts()
  const hasGoogleAccount = accounts.some(
    (a) => a.providerType === ProviderType.GOOGLE,
  )
  if (hasGoogleAccount || isLoading) return null

  return (
    <Link
      href="/~/settings/link-accounts"
      className="mt-2 p-3 rounded-lg bg-foreground/5 hover:bg-foreground/10 flex items-center justify-between cursor-pointer transition-all"
    >
      <div className="space-y-1 text-foreground/80">
        <div className="flex items-center gap-2">
          <IconGoogle className="w-4 h-4" />
          <div className="font-bold text-base">Link Google</div>
        </div>
        <div className="text-xs text-foreground/60 leading-normal">
          Link to google account for easier mobile login.
        </div>
      </div>
      <ArrowRight size={20} className="text-foreground/50 flex-shrink-0" />
    </Link>
  )
}
