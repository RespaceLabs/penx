import { useEffect, useState } from 'react'
import { Box } from '@fower/react'
import { getCookie, setCookie } from 'cookies-next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Button } from 'uikit'
import { appEmitter } from '../app-emitter'
import { Logo } from '../components/Logo'
import { ExportOldVersionSpaces } from './ExportOldVersionSpaces'
import { Nav } from './Nav'

export function HomePage() {
  const { push } = useRouter()

  const tags = [
    'Local-First',
    'Privacy-First',
    'Open Source',
    'End-To-End Encryption',
    'GitHub-Based Version control',
    'Meta tag',
  ]

  return (
    <Box
      fixed
      top0
      bottom0
      right0
      left0
      bgWhite
      column
      gap4
      toBetween
      toCenterX
    >
      <Box
        toBetween
        py3
        w={['98%', '98%', 760, 1080]}
        relative
        zIndex-10
        mx-auto
      >
        <Logo size={32} />
        <Box toRight toCenterY gap6>
          <Nav />
          <iframe
            src="https://ghbtns.com/github-btn.html?user=penxio&amp;repo=penx&amp;type=star&amp;count=true&amp;size=large"
            height={30}
            width={160}
            title="GitHub Stars"
          />
        </Box>
      </Box>
      <Box flex-1 toCenter column mt--80 gap5 px={[20, 0]}>
        <Box text={[28, 32, 48]} maxW-680 fontBold leadingNone textCenter>
          A structured note-taking app for personal use
        </Box>

        <Box textLG gray600>
          More than a note-taking app, It could be your{' '}
          <Box as="span" fontBold brand500>
            personal database
          </Box>{' '}
          with seamless input and output.
        </Box>

        <Box toCenter gap2 flexWrap>
          {tags.map((item) => (
            <Box
              key={item}
              h-40
              flexShrink-0
              roundedFull
              border
              borderGray200
              textSM
              px5
              toCenter
              gray600
            >
              {item}
            </Box>
          ))}
        </Box>

        <Box
          toCenterX
          mt6
          toCenterY
          gap2
          flexDirection={['column', 'column', 'row']}
        >
          <Button
            size="lg"
            w-220
            roundedFull
            onClick={() => {
              push('/login')
            }}
          >
            Login
          </Button>

          <ExportOldVersionSpaces />

          {/* <Box>Or</Box> */}

          {/* <Button
            as="a"
            variant="outline"
            noUnderline
            w-220
            href="https://chromewebstore.google.com/detail/penx/keodiemnjjlgbnjhdpomlagckkkcjakh"
            size="lg"
            roundedFull
            target="_blank"
          >
            Install Chrome Extension
          </Button> */}
        </Box>
      </Box>
    </Box>
  )
}
