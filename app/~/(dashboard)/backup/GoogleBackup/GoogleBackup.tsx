'use client'

import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { trpc } from '@/lib/trpc'
import { GoogleBackupConnected } from './GoogleBackupConnected'
import { GoogleOauthButton } from './GoogleOauthButton'

function Content() {
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
        <div>
          <GoogleOauthButton />
        </div>
      </Suspense>
    )
  }

  return <GoogleBackupConnected data={token} refetch={refetch} />
}

export function GoogleBackup() {
  return (
    <div className="relative flex flex-col gap-6">
      <div>
        <div className="text-zinc-600 mb-1 text-sm">
          Use Google Drive to backup your data.
        </div>
      </div>
      <Content />
    </div>
  )
}
