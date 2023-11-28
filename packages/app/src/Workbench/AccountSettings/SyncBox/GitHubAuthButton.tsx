import { useEffect, useState } from 'react'
import { Box } from '@fower/react'
import { toast } from 'sonner'
import { Button, Spinner } from 'uikit'
import { isServer } from '@penx/constants'
import { useUser } from '@penx/hooks'
import { IconGitHub } from '@penx/icons'

export function GitHubAuthButton() {
  const { id } = useUser()
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
      size="lg"
      disabled={loading}
      colorScheme="white"
      onClick={() => {
        setLoading(true)
        const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID
        const baseURL = process.env.NEXT_PUBLIC_NEXTAUTH_URL

        const callbackURL = `${baseURL}/api/github-oauth`
        const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&state=${id}&redirect_uri=${callbackURL}`

        location.href = url
      }}
      cursorNotAllowed={loading}
      gapX2
      w-200
    >
      {loading ? (
        <Spinner />
      ) : (
        <>
          <IconGitHub size={20} />
          <Box>Connect GitHub</Box>
        </>
      )}
    </Button>
  )
}
