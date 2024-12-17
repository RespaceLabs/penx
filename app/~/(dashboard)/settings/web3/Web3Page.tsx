'use client'

import { LoadingDots } from '@/components/icons/loading-dots'
import { trpc } from '@/lib/trpc'
import { Web3SettingForm } from './Web3SettingForm'

export function Web3Page() {
  return (
    <div>
      <Web3SettingForm />
    </div>
  )
}
