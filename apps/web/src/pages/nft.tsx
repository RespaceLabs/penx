import { useEffect } from 'react'
import { Box } from '@fower/react'

function PageNFT() {
  useEffect(() => {
    nft(1000, 0.2, 2)
  }, [])
  return <Box>NFT</Box>
}

export default PageNFT

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
