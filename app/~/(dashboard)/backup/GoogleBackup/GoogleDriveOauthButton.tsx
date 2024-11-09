import { useEffect, useState } from 'react'
import { IconGoogle } from '@/components/icons/IconGoogle'
import LoadingDots from '@/components/icons/loading-dots'
import { Button } from '@/components/ui/button'
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_DRIVE_OAUTH_REDIRECT_URI,
} from '@/lib/constants'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

interface Props {}

export function GoogleDriveOauthButton({}: Props) {
  const [loading, setLoading] = useState(false)

  const { data } = useSession()
  // Get error message added by next/auth in URL.
  const searchParams = useSearchParams()
  const error = searchParams?.get('error')

  useEffect(() => {
    const errorMessage = Array.isArray(error) ? error.pop() : error
    errorMessage && toast.error(errorMessage)
  }, [error])

  if (!data) return null

  return (
    <Button
      className="h-14 w-64 rounded-2xl gap-2"
      disabled={loading}
      onClick={() => {
        setLoading(true)
        const redirectUri = GOOGLE_DRIVE_OAUTH_REDIRECT_URI

        const state = `${location.protocol}//${location.host}____${data.address}`

        const scope = 'openid email https://www.googleapis.com/auth/drive.file'

        const googleAuthUrl =
          `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&redirect_uri=${redirectUri}` +
          `&scope=${scope}&client_id=${GOOGLE_CLIENT_ID}&state=${state}&access_type=offline&prompt=consent`
        // &prompt=consent

        location.href = googleAuthUrl
      }}
    >
      {loading && <LoadingDots />}
      {!loading && (
        <>
          <IconGoogle className="w-6 h-6" />
          <div className="grid gap-[2px]">
            <div className="text-base font-semibold">
              Backup to google drive
            </div>
            <div className="text-zinc-100 text-xs font-light">
              Connect to Google drive
            </div>
          </div>
        </>
      )}
    </Button>
  )
}
