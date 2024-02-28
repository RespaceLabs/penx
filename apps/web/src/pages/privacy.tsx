import { FC, PropsWithChildren, useEffect } from 'react'
import { Box } from '@fower/react'

const Title: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Box text3XL fontBold mb2>
      {children}
    </Box>
  )
}

export default function PageHome() {
  useEffect(() => {
    nft(1024, 0.1, 3)
  }, [])

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

function nft(maxSupply: number, minPrice: number, maxPrice: number) {
  let currentSupply = 0
  let tokenId = 0
  let sumFee = 0
  const arr = Array(maxSupply).fill(0)
  console.log('nft.....:', arr)
  for (const i of arr) {
    mintNFT()
  }

  console.log(
    '========sumFee:',
    sumFee.toFixed(2),
    (sumFee * 2500 * 7).toFixed(2),
  )

  function mintNFT() {
    const currentPrice = getCurrentPrice()
    tokenId++
    currentSupply++
    sumFee += currentPrice
    console.log(
      'tokenId:',
      tokenId,
      'currentSupply:',
      currentSupply,
      'currentPrice:',
      currentPrice.toFixed(2),
      'fee:',
      // sumFee.toFixed(2),
      (sumFee * 2500 * 7).toFixed(2),
    )
  }

  function getCurrentPrice() {
    if (currentSupply >= maxSupply) {
      return maxPrice
    } else {
      const priceRange = maxPrice - minPrice
      const priceIncrement = priceRange / maxSupply
      return minPrice + priceIncrement * currentSupply
    }
  }
}
