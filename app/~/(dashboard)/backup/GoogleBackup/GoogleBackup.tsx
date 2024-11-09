'use client'

import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { trpc } from '@/lib/trpc'
import { GoogleBackupConnected } from './GoogleBackupConnected'
import { GoogleDriveOauthButton } from './GoogleDriveOauthButton'

export function GoogleBackup() {
  const {
    data: token,
    isLoading,
    refetch,
  } = trpc.google.googleDriveToken.useQuery()
  if (isLoading) {
    return <Skeleton className="h-14 w-64 rounded-2xl"></Skeleton>
  }

  // console.log('=========token:', token)

  if (!token?.access_token) {
    return (
      <Suspense fallback={<Skeleton></Skeleton>}>
        <GoogleDriveOauthButton />
      </Suspense>
    )
  }

  return <GoogleBackupConnected data={token} refetch={refetch} />
}
