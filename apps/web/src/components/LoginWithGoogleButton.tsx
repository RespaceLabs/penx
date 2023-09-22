import { useEffect, useState } from 'react'
import { Box } from '@fower/react'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Button, Spinner } from 'uikit'
import { IconGoogle } from '@penx/icons'

export default function LoginWithGoogleButton() {
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
      disabled={loading}
      size="lg"
      colorScheme="white"
      onClick={() => {
        setLoading(true)
        signIn('google')
      }}
      cursorNotAllowed={loading}
      gapX2
      w-240
    >
      {loading ? (
        <Spinner />
      ) : (
        <>
          <IconGoogle />
          <Box>Login with Google</Box>
        </>
      )}
    </Button>
  )
}
