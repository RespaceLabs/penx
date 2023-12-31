import { useEffect, useState } from 'react'
import { Box, css } from '@fower/react'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Button, Spinner } from 'uikit'
import { IconGitHub } from '@penx/icons'

export default function LoginWithGithubButton() {
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
        signIn('github')
      }}
      cursorNotAllowed={loading}
      gapX2
      w-240
    >
      {loading ? (
        <Spinner />
      ) : (
        <>
          <IconGitHub size={20}></IconGitHub>
          <Box>Login with GitHub</Box>
        </>
      )}
    </Button>
  )
}
