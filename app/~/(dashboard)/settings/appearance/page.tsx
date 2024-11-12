'use client'

import LoadingDots from '@/components/icons/loading-dots'
import { trpc } from '@/lib/trpc'
import { AppearanceSettingForm } from './AppearanceSettingForm'

export const dynamic = 'force-static'

export default function Page() {
  const { isLoading, data, error } = trpc.site.getSite.useQuery()

  if (isLoading) {
    return (
      <div>
        <LoadingDots className="bg-foreground/60" />
      </div>
    )
  }
  return (
    <div>
      <AppearanceSettingForm site={data!} />
    </div>
  )
}
