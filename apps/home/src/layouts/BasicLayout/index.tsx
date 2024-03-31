import { FC, PropsWithChildren } from 'react'
import { Box } from '@fower/react'
import { Button } from 'uikit'
import { Logo } from '@penx/widget'
import { Footer } from './Footer'
import { Nav } from './Nav'
import { SocialNav } from './SocialNav'

export const BasicLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Box bgWhite column gap4 toBetween toCenterX>
      <Box
        toBetween
        py3
        w={['98%', '98%', '100%']}
        relative
        zIndex-10
        px={[20, 20, 20, 20]}
        mx-auto
      >
        <Box toCenterY gap8>
          <Logo size={32} />
        </Box>

        <Nav />

        <Box toCenterY gap10 display={['none', 'none', 'flex']}>
          <SocialNav />

          <Button
            // size="lg"
            variant="outline"
            roundedFull
            onClick={() => {
              window.open('https://app.penx.io')
            }}
          >
            Get early access
          </Button>
        </Box>
      </Box>
      {/* <Box flex-1 toCenter column gap8 px={[20, 0]}></Box> */}
      {children}
      <Box w={['98%', '98%', 760, 1300]}>
        <Footer></Footer>
      </Box>
    </Box>
  )
}
