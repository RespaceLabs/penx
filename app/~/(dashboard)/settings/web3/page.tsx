'use client'

import LoadingDots from '@/components/icons/loading-dots'
import { trpc } from '@/lib/trpc'
import { Web3SettingForm } from './Web3SettingForm'

export const dynamic = 'force-static'

export default function Page() {
  const { isLoading, data } = trpc.site.getSite.useQuery()

  if (isLoading) {
    return (
      <div>
        <LoadingDots className="bg-foreground/60" />
      </div>
    )
  }
  return (
    <div>
      <Web3SettingForm site={data!} />
    </div>
  )
}
