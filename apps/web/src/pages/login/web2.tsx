import { Suspense, useMemo } from 'react'
import { Box } from '@fower/react'
import { Redo } from 'lucide-react'
import { useRouter } from 'next/router'
import { NEXTAUTH_PROVIDERS } from '@penx/constants'
import { LoginForm } from '~/components/LoginForm/LoginForm'
import LoginWithGithubButton from '~/components/LoginWithGithubButton'
import LoginWithGoogleButton from '~/components/LoginWithGoogleButton'
import { Logo } from '~/components/Logo'

export default function LoginPage() {
  const { push } = useRouter()

  const providers = useMemo(() => {
    if (!NEXTAUTH_PROVIDERS) return []
    return (NEXTAUTH_PROVIDERS || '').split(',')
  }, [])

  const showGoogle = providers.includes('GOOGLE')
  const showGitHub = providers.includes('GITHUB')

  const loginEntry = useMemo(() => {
    if (process.env.NEXT_PUBLIC_DEPLOY_MODE === 'SELF_HOSTED') {
      return <LoginForm />
    }

    return (
      <Box column gap4 toCenterX>
        {/* <SiweModal /> */}
        {showGitHub && (
          <Suspense fallback={<Box my2 h10 w-100p border borderStone200 />}>
            <LoginWithGithubButton />
          </Suspense>
        )}
        {showGoogle && (
          <Suspense fallback={<Box my2 h10 w-100p border borderStone200 />}>
            <LoginWithGoogleButton />
          </Suspense>
        )}

        <Box
          toCenterY
          gap2
          gray400
          gray600--hover
          cursorPointer
          // onClick={() => push('/login/web3')}
          onClick={() => push('/login')}
        >
          <Redo size={16}></Redo>
          <Box textSM>Back to web3 login</Box>
        </Box>
      </Box>
    )
  }, [showGoogle, showGitHub, push])

  return (
    <Box column h-100vh>
      <Box mx-auto py8 toCenter>
        <Logo to="/" />
      </Box>
      <Box column flex-1 toCenter>
        <Box
          toCenter
          py10
          roundedXL
          mx-auto
          bgWhite
          column
          mt--200
          w={['100%', '100%', 480]}
        >
          {loginEntry}
        </Box>
      </Box>
    </Box>
  )
}
