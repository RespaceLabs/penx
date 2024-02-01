import { useEffect, useState } from 'react'
import { Box } from '@fower/react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { Button, Spinner } from 'uikit'
import { isServer } from '@penx/constants'
import { useUser } from '@penx/hooks'
import { IconGitHub } from '@penx/icons'

export function BindGitHubButton() {
  const { data } = useSession()
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
      variant="light"
      colorScheme="gray600"
      onClick={() => {
        setLoading(true)
        const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID
        const baseURL = process.env.NEXT_PUBLIC_NEXTAUTH_URL
        const userId = data?.userId as string

        const callbackURL = `${baseURL}/api/bind-task-github`
        const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&state=${userId}&redirect_uri=${callbackURL}`

        location.href = url
      }}
      cursorNotAllowed={loading}
      gapX2
    >
      {loading ? (
        <Spinner />
      ) : (
        <>
          <IconGitHub size={24} />
          <Box column>
            <Box>Bind GitHub Account</Box>
            <Box textXS gray400>
              Connect GitHub to start a task
            </Box>
          </Box>
        </>
      )}
    </Button>
  )
}
