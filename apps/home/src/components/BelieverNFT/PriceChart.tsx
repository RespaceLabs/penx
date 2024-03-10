import { Box } from '@fower/react'
import { useBelieverInfo } from './useBelieverInfo'

export function PriceChart() {
  const { data } = useBelieverInfo()
  console.log('=======data:', data)

  if (!data) return null

  return (
    <Box inlineFlex column>
      <Box w-300 h-200 toCenterY relative overflowHidden>
        <Box absolute top0 gray400>
          The price of NFTs increases linearly
        </Box>
        <Box w-100p rotate={-20} relative toBetween zIndex-1>
          <Box square-6 roundedFull bgPurple400 mt--1 zIndex-1 relative />
          <Box h-2 w-100p bgGreen500 zIndex-0 relative>
            <Box absolute text-10 mt--20 left={data.percentFormatted}>
              {data.currentPriceDecimal} ETH
            </Box>
            <Box
              absolute
              square-4
              bgYellow500
              roundedFull
              top--1
              ringYellow500-2--T40
              left={data.percentFormatted}
            ></Box>
          </Box>
          <Box square-6 roundedFull bgBlue500 mt--2 zIndex-1 relative />
        </Box>
        <Box
          absolute
          top-150
          bottom0
          left-11
          w-20
          borderLeft
          borderLeftGreen500--T40
          borderDashed
          zIndex-0
        ></Box>
        <Box
          absolute
          top-50
          bottom0
          right--7
          h-300
          w-20
          borderLeft
          borderLeftGreen500
          borderDashed
          zIndex-0
        ></Box>
      </Box>
      <Box toBetween textXS bottom--18 w-100p>
        <Box>{data.minPriceDecimal} ETH</Box>
        <Box>{data.maxPriceDecimal} ETH</Box>
      </Box>
    </Box>
  )
}
