import { Box } from '@fower/react'
import { DisconnectButton } from '@penx/app'
import { useAccount, WalletConnectButton } from '@penx/wagmi'
import { Logo } from '../Logo'
import { MintButton } from './MintButton'
import { NFTBasicInfo } from './NFTBasicInfo'
import { PriceChart } from './PriceChart'

const urls = [
  'https://boredapeyachtclub.com/_next/image?url=https%3A%2F%2Fmedia.10ktf.com%2Fpfps-resized%2F250%2F6%2F14.webp&w=640&q=75',
  'https://boredapeyachtclub.com/_next/image?url=https%3A%2F%2Fmedia.10ktf.com%2Fpfps-resized%2F250%2F6%2F13.webp&w=828&q=75',
  'https://boredapeyachtclub.com/_next/image?url=https%3A%2F%2Fmedia.10ktf.com%2Fpfps-resized%2F250%2F6%2F9.webp&w=640&q=75',
  'https://boredapeyachtclub.com/_next/image?url=https%3A%2F%2Fmedia.10ktf.com%2Fpfps-resized%2F250%2F6%2F2.webp&w=828&q=75',
  'https://boredapeyachtclub.com/_next/image?url=https%3A%2F%2Fmedia.10ktf.com%2Fpfps-resized%2F250%2F6%2F1.webp&w=828&q=75',
  'https://boredapeyachtclub.com/_next/image?url=https%3A%2F%2Fmedia.10ktf.com%2Fpfps-resized%2F250%2F6%2F0.webp&w=828&q=75',
  'https://boredapeyachtclub.com/_next/image?url=https%3A%2F%2Fmedia.10ktf.com%2Fpfps-resized%2F250%2F6%2F53.webp&w=640&q=75',
  'https://boredapeyachtclub.com/_next/image?url=https%3A%2F%2Fmedia.10ktf.com%2Fpfps-resized%2F250%2F6%2F31.webp&w=640&q=75',
  'https://boredapeyachtclub.com/_next/image?url=https%3A%2F%2Fmedia.10ktf.com%2Fpfps-resized%2F250%2F6%2F19.webp&w=828&q=75',
  'https://boredapeyachtclub.com/_next/image?url=https%3A%2F%2Fmedia.10ktf.com%2Fpfps-resized%2F250%2F6%2F75.webp&w=640&q=75',
]

export function BelieverNFT() {
  const { isConnected } = useAccount()
  const list = Array(1000)
    .fill('')
    .map((_, i) => i)

  return (
    <Box maxW-1200 m-auto pt4 relative>
      <DisconnectButton absolute right0 top-10 />
      <Box toBetween toCenterY>
        <Box>
          <Box text2XL fontBold gray500 mb4>
            What Believer NFT can do?
          </Box>
          <Box column gap2 gray400>
            <Box>Everything in Pro Plan plus forever </Box>
            <Box>First Access to New Features</Box>
            <Box>Calls with the Team Priority Support</Box>
          </Box>
        </Box>
        <Box mb10 toCenter column gap4>
          <Logo mb20 />
          <Box text5XL fontBold>
            PenX Believer NFT
          </Box>
          <NFTBasicInfo />
          {isConnected && <MintButton />}
          {!isConnected && (
            <WalletConnectButton size={56} w-300>
              Connect to mint
            </WalletConnectButton>
          )}
        </Box>
        <PriceChart />
      </Box>
      <Box grid gridTemplateColumns-4 gap4 mt10>
        {list.map((item) => (
          <Box key={item} column gap2>
            <Box shadowPopover rounded2XL toCenter h-250 w-250 overflowHidden>
              <Box
                w-100p
                h-100p
                as="img"
                src={urls[Math.floor(Math.random() * urls.length)]}
              />
            </Box>
            <Box textLG gray400>
              #{item}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
