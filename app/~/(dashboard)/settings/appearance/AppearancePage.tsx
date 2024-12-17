'use client'

import { LoadingDots } from '@/components/icons/loading-dots'
import { trpc } from '@/lib/trpc'
import { AppearanceSettingForm } from './AppearanceSettingForm'

export function AppearancePage() {
  return (
    <div>
      <AppearanceSettingForm />
    </div>
  )
}
