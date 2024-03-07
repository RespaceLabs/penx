import { Box } from '@fower/react'
import { useRouter } from 'next/router'
import { Button } from 'uikit'

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
    <Box bgWhite column gap4 toBetween toCenterX>
      <Box flex-1 toCenter column gap8 px={[20, 0]}>
        <Box
          text={[28, 50, 70]}
          maxW-760
          fontBlack
          leadingNone
          textCenter
          black
          mt={[120]}
          p0
        >
          The{' '}
          <Box
            as="span"
            transparent
            inlineFlex
            bgClipText
            bgGradientX={['brand500', 'fuchsia500', 'indigo500']}
          >
            Second Brain
          </Box>{' '}
          App for{' '}
          <Box
            as="span"
            relative
            // black
            inlineFlex
            css={{
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: -2,
                left: 0,
                width: '100%',
                height: '7px',
                roundedFull: true,
                // background: 'brand500',
                backgroundImage:
                  'linear-gradient(to right, rgb(107, 55, 255), rgb(59, 130, 246))',
              },
            }}
          >
            Geeks
          </Box>{' '}
        </Box>

        <Box textLG neutral500 maxW-640 textCenter leadingNormal>
          A structured Note-taking app for personal use. An elegant tool
          designed to help you capture, organize, and store your thoughts,
          ideas, and information.
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

        <Box>
          <Button
            size={56}
            // colorScheme="black"
            bgGradientX={['brand500', 'fuchsia600']}
            bgGradientX--hover={['brand400', 'fuchsia500']}
            roundedFull
            w-240
            onClick={() => {
              window.open('https://app.penx.io/login/web3')
            }}
          >
            Get early access
          </Button>
        </Box>

        <Box as="img" src="/images/editor.png" w-1200 />
      </Box>
    </Box>
  )
}
