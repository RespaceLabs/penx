import { useMemo } from 'react'
import { Box } from '@fower/react'
import { ArrowRight, Wallet } from 'lucide-react'
import { useRouter } from 'next/router'
import { ClientOnly } from '~/components/ClientOnly'
import { Logo } from '~/components/Logo'
import { WalletConnectButton } from '~/components/WalletConnectButton'

export default function LoginPage() {
  const { push } = useRouter()
  const loginEntry = useMemo(() => {
    return (
      <Box column gap2 toCenterX>
        {/* <SiweModal /> */}
        <ClientOnly>
          <WalletConnectButton
            size={56}
            roundedFull
            colorScheme="white"
            toBetween
          >
            <Wallet />
            <Box column gap1>
              <Box textBase fontSemibold>
                Login with Wallet
              </Box>
              <Box gray800 textXS fontLight>
                For web3 users and builders
              </Box>
            </Box>
          </WalletConnectButton>

          <Box
            toCenterY
            gap2
            gray400
            gray600--hover
            cursorPointer
            onClick={() => push('/login/web2')}
          >
            <Box textSM>Login with Google, GitHub</Box>
            <ArrowRight size={16}></ArrowRight>
          </Box>
        </ClientOnly>
      </Box>
    )
  }, [push])

  return (
    <Box column h-100vh>
      <Box mx-auto py8 toCenter>
        <Logo />
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
          <Box as="h1" fontBold>
            Welcome to PenX
          </Box>
          <Box as="p" textCenter mb6 leadingNormal px10 gray500>
            A structured note-taking app for personal use
          </Box>

          {loginEntry}
        </Box>
      </Box>
    </Box>
  )
}
