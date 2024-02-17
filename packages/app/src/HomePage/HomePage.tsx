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
import { SocialNav } from './SocialNav'

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
        w={['98%', '98%', 760, 1120]}
        relative
        zIndex-10
        px={[20, 20, 0]}
        mx-auto
      >
        <Box toCenterY gap8>
          <Logo size={32} />
          <Nav />
        </Box>

        <Box toCenterY gap2 display={['none', 'none', 'flex']}>
          <SocialNav />
        </Box>
      </Box>
      <Box flex-1 toCenter column mt--80 gap5 px={[20, 0]}>
        <Box text={[28, 32, 48]} maxW-680 fontBold leadingNone textCenter>
          A structured note-taking app for personal use
        </Box>

        <Box textLG gray500 maxW-680 textCenter>
          PenX is a structured note-taking app designed for personal use. In
          PenX, Privacy is first important thing. our mission is building a
          elegant tool to manage personal digital assets, like notes, tasks,
          ideas, password, document.
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
          <ExportOldVersionSpaces />

          <Button
            size="lg"
            w-220
            roundedFull
            onClick={() => {
              push('/login')
            }}
          >
            Launch App
          </Button>

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
