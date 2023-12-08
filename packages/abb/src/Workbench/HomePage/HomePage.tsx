import { useEffect, useState } from 'react'
import { Box } from '@fower/react'
import { getCookie, setCookie } from 'cookies-next'
import { Button } from 'uikit'
import { PENX_HOME_STATUS } from '@penx/constants'
import { appEmitter } from '../../app-emitter'
import { Logo } from '../../components/Logo'

export function HomePage() {
  const [visible, setVisible] = useState(getCookie(PENX_HOME_STATUS) !== 'HIDE')

  useEffect(() => {
    function handler() {
      setVisible(true)
    }
    appEmitter.on('OPEN_HOME', handler)
    return () => {
      appEmitter.off('OPEN_HOME')
    }
  }, [])

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
      zIndex-10000
      // bgWhite
      opacity-90
      column
      gap4
      hidden={!visible}
      flex={visible}
      style={{
        backdropFilter: 'blur(40px)',
      }}
      toBetween
      toCenterX
    >
      <Box py3 relative zIndex-10>
        <Logo size={32} />
      </Box>
      <Box flex-1 toCenter column mt--80 gap5 px={[20, 0]}>
        <Box text={[28, 32, 48]} maxW-680 fontBold leadingNone textCenter>
          A structured note-taking app for personal use
        </Box>

        <Box textLG gray600>
          More than a note-taking app, It could be your personal database with
          easy input and output.
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

        <Box toCenterX mt6>
          <Button
            size="lg"
            w-180
            roundedFull
            onClick={() => {
              setVisible(false)
              setCookie(PENX_HOME_STATUS, 'HIDE')
            }}
          >
            Go to App
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
