'use client'

import LoadingDots from '@/components/icons/loading-dots'
import { trpc } from '@/lib/trpc'
import { SiteSettingForm } from './SiteSettingForm'

export default function Page() {
  const { isLoading, data } = trpc.site.getSite.useQuery()

  if (isLoading) {
    return (
      <div>
        <LoadingDots />
      </div>
    )
  }
  return (
    <div>
      <SiteSettingForm site={data!} />
    </div>
  )
}
