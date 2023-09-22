import { Suspense } from 'react'
import { Box } from '@fower/react'
import LoginWithGithubButton from '~/components/LoginWithGithubButton'
import LoginWithGoogleButton from '~/components/LoginWithGoogleButton'
import { Logo } from '~/components/Logo'

export default function LoginPage() {
  return (
    <Box column h-100vh>
      <Box container mx-auto py8 toCenter>
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
          <Box as="h1" fontBold>
            Welcome to PenX
          </Box>
          <Box as="p" textCenter mb6 leadingNormal px10 gray500>
            PenX is an open-source collaborative editor to manage Markdown
            content
          </Box>
          <Box column gap4>
            <Suspense fallback={<Box my2 h10 w-100p border borderStone200 />}>
              <LoginWithGithubButton />
            </Suspense>

            <Suspense fallback={<Box my2 h10 w-100p border borderStone200 />}>
              <LoginWithGoogleButton />
            </Suspense>
          </Box>
          {/* <Box pt6>
            You can also <Box as="a"> continue with SAML SSO</Box>
          </Box> */}
        </Box>
      </Box>
    </Box>
  )
}
