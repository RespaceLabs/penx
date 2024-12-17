'use client'

import { LoadingDots } from '@/components/icons/loading-dots'
import { trpc } from '@/lib/trpc'
import { SiteSettingForm } from './SiteSettingForm'

// export const runtime = 'edge'
// export const dynamic = 'force-static'

export default function Page() {
  return (
    <div>
      <SiteSettingForm />
    </div>
  )
}
