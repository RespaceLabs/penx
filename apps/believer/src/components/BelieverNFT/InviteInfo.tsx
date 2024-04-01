import { Box } from '@fower/react'
import { useRouter } from 'next/router'

export function InviteInfo() {
  const { query } = useRouter()

  if (!query.ref) return null

  return (
    <Box bgGray100 rounded3XL p6 gray700 column gap2>
      <Box>Your friend is inviting you to mint a PenX Believer NFT.</Box>
      <Box toCenter column my3>
        <Box textSM gray400>
          Referral code
        </Box>
        <Box text4XL fontSemibold gray800>
          {query.ref}
        </Box>
      </Box>
      <Box as="ul" listNone column gap3 textSM>
        <Box as="li">Your friend will receive 10% mint fee (ETH) reward.</Box>
        <Box as="li">You will get 10% discount on the mint fee.</Box>
      </Box>
    </Box>
  )
}
