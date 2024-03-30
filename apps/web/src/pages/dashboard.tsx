import React from 'react'
import { Dashboard } from '@penx/app'
import { SessionProvider, useSession } from '@penx/session'
import { CommonLayout } from '~/layouts/CommonLayout'

export default function DashboardPage() {
  const { data: session } = useSession()
  return <Dashboard userId={session?.userId as string} />
}

DashboardPage.Layout = CommonLayout
