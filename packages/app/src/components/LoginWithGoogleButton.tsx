import { useEffect, useState } from 'react'
import { Box } from '@fower/react'
import { toast } from 'sonner'
import { Button, Spinner } from 'uikit'
import { IconGoogle } from '@penx/icons'
import { appEmitter } from '../app-emitter'
import { isServer } from '../common'

export default function LoginWithGoogleButton() {
  const [loading, setLoading] = useState(false)

  // Get error message added by next/auth in URL.
  const searchParams = new URLSearchParams(
    isServer ? '' : location.search.replace(/^\?/, ''),
  )

  const error = searchParams?.get('error')

  useEffect(() => {
    const errorMessage = Array.isArray(error) ? error.pop() : error
    errorMessage && toast.error(errorMessage)
  }, [error])

  return (
    <Button
      disabled={loading}
      size="lg"
      mb2
      colorScheme="white"
      cursorNotAllowed={loading}
      gapX2
      w={['100%', '100%', 240]}
      onClick={() => {
        setLoading(true)
        appEmitter.emit('SIGN_IN_GOOGLE')
      }}
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
