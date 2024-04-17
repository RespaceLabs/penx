import { useEffect, useState } from 'react'
import { Box } from '@fower/react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Button, Spinner } from 'uikit'
import { IconGoogle } from '@penx/icons'
import { useSession } from '@penx/session'

interface Props {
  from: 'backup' | 'mnemonic'
}

export function GoogleOauthButton({ from }: Props) {
  const [loading, setLoading] = useState(false)

  const { data } = useSession()
  // Get error message added by next/auth in URL.
  const searchParams = useSearchParams()
  const error = searchParams?.get('error')

  useEffect(() => {
    const errorMessage = Array.isArray(error) ? error.pop() : error
    errorMessage && toast.error(errorMessage)
  }, [error])

  return (
    <Button
      disabled={loading}
      size={56}
      colorScheme="white"
      cursorNotAllowed={loading}
      gapX2
      w-280
      toBetween
      onClick={() => {
        setLoading(true)
        const redirectUri = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/google-oauth`

        const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

        // const scope = 'https://www.googleapis.com/auth/drive'
        // const scope = 'email https://www.googleapis.com/auth/drive.file'
        const scope =
          'openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/drive.file'

        const googleAuthUrl =
          `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&redirect_uri=${redirectUri}` +
          `&scope=${scope}&client_id=${googleClientId}&state=${data.userId}__${from}&access_type=offline&prompt=consent`
        // &prompt=consent

        location.href = googleAuthUrl
      }}
    >
      {loading && <Spinner />}
      <IconGoogle size={24} />
      <Box column gap1>
        <Box textBase fontSemibold>
          Backup to google drive
        </Box>
        <Box gray800 textXS fontLight>
          Connect to Google drive
        </Box>
      </Box>
    </Button>
  )
}
