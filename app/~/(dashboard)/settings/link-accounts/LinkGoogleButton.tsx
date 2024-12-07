'use client'

import { useEffect, useState } from 'react'
import { IconGoogle } from '@/components/icons/IconGoogle'
import LoadingDots from '@/components/icons/loading-dots'
import { Button } from '@/components/ui/button'
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_OAUTH_REDIRECT_URI,
  LINK_GOOGLE_ACCOUNT_REDIRECT_URI,
} from '@/lib/constants'
import { cn } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

export function LinkGoogleButton() {
  const [loading, setLoading] = useState(false)
  // Get error message added by next/auth in URL.
  const searchParams = useSearchParams()
  const error = searchParams?.get('error')
  const { data } = useSession()

  useEffect(() => {
    const errorMessage = Array.isArray(error) ? error.pop() : error
    errorMessage && toast.error(errorMessage)
  }, [error])
  return (
    <div>
      <Button
        size="lg"
        className={cn('rounded-lg gap-2 w-full')}
        disabled={loading}
        onClick={() => {
          setLoading(true)
          const redirectUri = LINK_GOOGLE_ACCOUNT_REDIRECT_URI
          const state = `${location.protocol}//${location.host}____${data?.userId}`
          const scope = 'openid email profile'
          const googleAuthUrl =
            `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&redirect_uri=${redirectUri}` +
            `&scope=${scope}&client_id=${GOOGLE_CLIENT_ID}&state=${state}&access_type=offline`
          // &prompt=consent
          location.href = googleAuthUrl
        }}
      >
        {loading && <LoadingDots className="bg-background" />}
        {!loading && (
          <>
            <IconGoogle className="w-4 h-4" />
            <div className="">Link Google</div>
          </>
        )}
      </Button>
    </div>
  )
}
