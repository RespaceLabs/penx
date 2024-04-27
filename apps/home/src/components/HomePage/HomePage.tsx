import { Box } from '@fower/react'
import { useRouter } from 'next/router'
import { Button } from 'uikit'

export function HomePage() {
  const { push } = useRouter()

  const tags = ['Structured', 'Local-First', 'Privacy-First', 'Open Source']

  return (
    <Box bgWhite column gap4 toBetween toCenterX>
      <Box flex-1 toCenter column gap8 px={[20, 0]}>
        <Box
          text={[42, 80, 100]}
          maxW-900
          fontBold
          leadingNone
          textCenter
          black
          mt={[80, 120]}
          p0
        >
          Structured
          <br /> Knowledge Base
        </Box>

        <Box textLG neutral500 maxW-640 textCenter leadingNormal>
          An elegant App designed to help you capture, organize, and store your
          thoughts, tasks, ideas, and information.
        </Box>

        <Box toCenter gap2 flexWrap>
          {tags.map((item) => (
            <Box
              key={item}
              h-40
              flexShrink-0
              roundedFull
              // border
              // borderGray200
              bgNeutral100
              textSM
              px5
              toCenter
              gray600
            >
              {item}
            </Box>
          ))}
        </Box>

        {/* <Box
          black
          brand500
          brand600--hover
          noUnderline
          px4
          py2
          textLG
          roundedFull
          // bgNeutral100
          as="a"
          href="https://blog.penx.io/blog/why-build-penx"
          target="_blank"
        >
          Why we build PenX?
        </Box> */}

        <Box>
          <Button
            size={56}
            colorScheme="black"
            // variant="outline"
            // bgGradientX={['brand500', 'fuchsia600']}
            // bgGradientX--hover={['brand400', 'fuchsia500']}
            roundedFull
            w-240
            onClick={() => {
              window.open('https://app.penx.io')
            }}
          >
            Get early access
          </Button>
        </Box>

        <Box relative mt20 mb40>
          <Box
            display={['none', 'none', 'flex']}
            as="img"
            src="/images/editor.png"
            shadow="0px 1px 19px 0px rgba(42,44,48,.06),0px 0px 48px 0px rgba(200, 200, 200,.6)"
            border
            borderNeutral200--T20
            rounded-12
            w={['100%', '100%', 760, 840, 1200]}
          />

          <Box
            as="img"
            src="/images/editor-phone.jpg"
            shadow="0px 1px 19px 0px rgba(42,44,48,.06),0px 0px 48px 0px rgba(200, 200, 200,.6)"
            rounded-8
            w={['100%', '100%', 200, 220, 280]}
            absolute={[false, false, true]}
            right={[-40]}
            bottom={[0]}
          />
        </Box>
      </Box>
    </Box>
  )
}
