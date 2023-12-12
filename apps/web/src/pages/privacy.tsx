import { FC, PropsWithChildren } from 'react'
import { Box } from '@fower/react'

const Title: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Box text3XL fontBold mb2>
      {children}
    </Box>
  )
}

export default function PageHome() {
  return (
    <Box textLG py20 leadingNormal maxW-860 mx-auto column gap4>
      <Title>Privacy Policy</Title>
      <Box>
        We proudly know absolutely nothing about what you put into PenX.
      </Box>
      <Box>
        We don’t track you. We don’t gather, transfer, sell, trade, gamble,
        stir-fry, ferment, decorate, or dance salsa with your data. It’s your
        data — not ours.
      </Box>
      <Title>Cookies</Title>

      <Box>Real life? Delicious. Internet life? Atrocious.</Box>

      <Box>
        No cookies here. Tons of other sites force you to accept cookies which
        means they are allowed to follow you across the internet with ads. Yuck.
        Fathom Analytics gives us just enough anonymous info to deliver a great
        product to you or send you on your way. You’re the consumer. Consume
        what you want, not what’s forced. Consume real cookies, not creepy
        digital ones.
      </Box>

      <Title>Browser permissions</Title>

      <Box>
        If you use PenX on your browser, it may request permission to access all
        visited web pages and browsing history. The only permission we requested
        is storage permission, we use it to store you personal settings.
      </Box>

      <Title>Contact us</Title>

      <Box>Anything you want to know is yours, just give me a shout: </Box>
      <Box textXL fontBold>
        0xzion.penx@gmail.com
      </Box>
    </Box>
  )
}
