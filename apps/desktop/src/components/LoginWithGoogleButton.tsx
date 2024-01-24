import { useEffect, useState } from 'react'
import { Box } from '@fower/react'
import { Button, Spinner } from 'uikit'
import { IconGoogle } from '@penx/icons'

export default function LoginWithGoogleButton() {
  const [loading, setLoading] = useState(false)

  // Get error message added by next/auth in URL.

  return (
    <Button
      disabled={loading}
      size="lg"
      colorScheme="white"
      onClick={() => {
        //
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
