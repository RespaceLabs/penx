import { Suspense, useEffect, useMemo } from 'react'
import { Box } from '@fower/react'
import { ArrowRight, Wallet } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ClientOnly } from '~/components/ClientOnly'
import LoginWithGoogleButton from '~/components/LoginWithGoogleButton'
import { Logo } from '~/components/Logo'
import { SiweModal } from '~/components/SiweModal'
import { WalletConnectButton } from '~/components/WalletConnectButton'
import { WalletConnectProvider } from '~/components/WalletConnectProvider'

export default function LoginPage() {
  const { push } = useRouter()

  const loginEntry = useMemo(() => {
    return (
      <Box column gap2 toCenterX>
        <SiweModal />

        <Suspense fallback={<Box my2 h10 w-100p border borderStone200 />}>
          <LoginWithGoogleButton />
        </Suspense>
        <ClientOnly>
          <WalletConnectButton size="lg" colorScheme="white" w-240 roundedXL>
            <Wallet />
            <Box column gap1>
              <Box textBase fontSemibold>
                Login with Wallet
              </Box>
            </Box>
          </WalletConnectButton>
        </ClientOnly>
      </Box>
    )
  }, [])

  return (
    <ClientOnly>
      <WalletConnectProvider>
        <Box column h-100vh>
          <Box mx-auto py8 toCenter>
            <Logo to="/" />
          </Box>
          <Box column flex-1 toCenter>
            <Box
              toCenter
              py10
              rounded3XL
              mx-auto
              bgWhite
              column
              mt--200
              border
              w={['100%', '100%', 480]}
            >
              <Box as="h1" fontBold>
                Welcome to PenX
              </Box>
              <Box as="p" textCenter mb6 leadingNormal px10 gray500>
                A structured note-taking app for personal use
              </Box>

              {loginEntry}
              <Box gray400 textXS maxW-360 mt5 textCenter>
                By creating an account you agree to our{' '}
                <Box as="a" href="https://www.penx.io/privacy" target="_blank">
                  privacy policy
                </Box>{' '}
                and{' '}
                <Box as="a" href="https://www.penx.io/terms" target="_blank">
                  terms of service
                </Box>
                .
              </Box>
            </Box>
          </Box>
        </Box>
      </WalletConnectProvider>
    </ClientOnly>
  )
}
