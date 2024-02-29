import { Box } from '@fower/react'
import { useAccount } from 'wagmi'
import { DisconnectButton } from '../DisconnectButton'
import { Logo } from '../Logo'
import { WalletConnectButton } from '../WalletConnectButton'
import { MintButton } from './MintButton'
import { NFTBasicInfo } from './NFTBasicInfo'
import { PriceChart } from './PriceChart'

const urls = [
  'https://nft.chaingpt.org/_next/image?url=https%3A%2F%2Fnftapi.chaingpt.org%2F052ff39a-ce46-4ed7-b4dc-5e1cb7ca79a3.png&w=640&q=75',
  'https://nft.chaingpt.org/_next/image?url=https%3A%2F%2Fnftapi.chaingpt.org%2Ff0a902a5-611b-4c68-9459-26644cce02c5.png&w=640&q=75',
  'https://nft.chaingpt.org/_next/image?url=https%3A%2F%2Fnftapi.chaingpt.org%2F479474a5-dbd2-4782-be02-72add627bf23.png&w=640&q=75',
  'https://nft.chaingpt.org/_next/image?url=https%3A%2F%2Fnftapi.chaingpt.org%2Ffcc8d3ff-7888-47e8-91df-a2d154c636b5.png&w=640&q=75',
  'https://nft.chaingpt.org/_next/image?url=https%3A%2F%2Fnftapi.chaingpt.org%2Ffd90856d-ca42-41eb-b433-b480c27fc6fa.png&w=640&q=75',
  'https://nft.chaingpt.org/_next/image?url=https%3A%2F%2Fnftapi.chaingpt.org%2Fc96df63f-4763-4eec-a46d-e4304d488161.png&w=640&q=75',
  'https://nft.chaingpt.org/_next/image?url=https%3A%2F%2Fnftapi.chaingpt.org%2F7e63c2a9-3598-4d14-9116-c99e2cefcc8b.png&w=640&q=75',
  'https://nft.chaingpt.org/_next/image?url=https%3A%2F%2Fnftapi.chaingpt.org%2F2a6d242d-0f04-4496-9a84-25ca9f2eb9dd.png&w=640&q=75',
  'https://nft.chaingpt.org/_next/image?url=https%3A%2F%2Fnftapi.chaingpt.org%2Ffbc3a7ad-98c0-4cb5-b5c8-8314c236632f.png&w=640&q=75',
  'https://nft.chaingpt.org/_next/image?url=https%3A%2F%2Fnftapi.chaingpt.org%2F71575a79-d6a2-4022-a7f3-f21211323f38.png&w=640&q=75',
  'https://nft.chaingpt.org/_next/image?url=https%3A%2F%2Fnftapi.chaingpt.org%2Fa812ca83-05e8-46fc-ad9c-163ed51396e2.png&w=640&q=75',
  'https://nft.chaingpt.org/_next/image?url=https%3A%2F%2Fnftapi.chaingpt.org%2F7699d09b-e3ef-44d3-89da-290bad50636c.png&w=640&q=75',
  'https://nft.chaingpt.org/_next/image?url=https%3A%2F%2Fnftapi.chaingpt.org%2F6649e35f-955c-42e4-8922-e43055f5677e.png&w=640&q=75',
  'https://nft.chaingpt.org/_next/image?url=https%3A%2F%2Fnftapi.chaingpt.org%2Fd6f53605-8358-4b43-8be8-480a9a532fee.png&w=640&q=75',
  'https://nft.chaingpt.org/_next/image?url=https%3A%2F%2Fnftapi.chaingpt.org%2F57b79432-c7dd-44bb-9e3c-b8627315341b.png&w=640&q=100',
  'https://nft.chaingpt.org/_next/image?url=https%3A%2F%2Fnftapi.chaingpt.org%2Fef260154-8b88-4496-8a5e-eb33dc2c6d2d.png&w=640&q=100',
  'https://nft.chaingpt.org/_next/image?url=https%3A%2F%2Fnftapi.chaingpt.org%2F506fbe1a-40d9-4fe0-8eb7-bdd9cd21a0a2.png&w=640&q=75',
  'https://nft.chaingpt.org/_next/image?url=https%3A%2F%2Fnftapi.chaingpt.org%2Fe2065422-f7d2-44e1-8811-640cb1ae0418.png&w=640&q=75',
  'https://nft.chaingpt.org/_next/image?url=https%3A%2F%2Fnftapi.chaingpt.org%2Fa6f89798-2681-4438-9581-90ddda33396c.png&w=640&q=75',
  'https://nft.chaingpt.org/_next/image?url=https%3A%2F%2Fnftapi.chaingpt.org%2F17252acf-0cdf-4916-ac39-1e6cf10a454a.png&w=640&q=75',
  'https://nft.chaingpt.org/_next/image?url=https%3A%2F%2Fnftapi.chaingpt.org%2Fed7e57b4-fa62-44ea-bf7a-54be19b4d2d5.png&w=640&q=75',
  'https://nft.chaingpt.org/_next/image?url=https%3A%2F%2Fnftapi.chaingpt.org%2F79fbf58b-2e5c-4379-9349-e90e273a98d0.png&w=640&q=75',
]

export function BelieverNFT() {
  const { isConnected } = useAccount()
  console.log('=====isConnected:', isConnected)

  const list = Array(1024)
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
