import { useEffect, useState } from 'react'
import { IconGoogle } from '@/components/icons/IconGoogle'
import LoadingDots from '@/components/icons/loading-dots'
import { Button } from '@/components/ui/button'
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_DRIVE_OAUTH_REDIRECT_URI,
  GOOGLE_OAUTH_REDIRECT_URI,
} from '@/lib/constants'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

interface Props {}

export function GoogleOauthButton({}: Props) {
  const [loading, setLoading] = useState(false)
  // Get error message added by next/auth in URL.
  const searchParams = useSearchParams()
  const error = searchParams?.get('error')

  useEffect(() => {
    const errorMessage = Array.isArray(error) ? error.pop() : error
    errorMessage && toast.error(errorMessage)
  }, [error])

  return (
    <Button
      className="rounded-xl gap-2 text-sm w-24"
      disabled={loading}
      onClick={() => {
        setLoading(true)
        const redirectUri = GOOGLE_OAUTH_REDIRECT_URI

        const state = `${location.protocol}//${location.host}`
        const scope = 'openid email profile'
        const googleAuthUrl =
          `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&redirect_uri=${redirectUri}` +
          `&scope=${scope}&client_id=${GOOGLE_CLIENT_ID}&state=${state}&access_type=offline`
        // &prompt=consent

        location.href = googleAuthUrl
      }}
    >
      {loading && <LoadingDots color="white" />}
      {!loading && (
        <>
          <IconGoogle className="w-4 h-4" />
          <div className="">Login</div>
        </>
      )}
    </Button>
  )
}
