import { useInterval } from 'react-use'
import { Box } from '@fower/react'
import { Copy } from 'lucide-react'
import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  toast,
  useModalContext,
} from 'uikit'
import { ModalNames } from '@penx/constants'
import { useCopyToClipboard } from '@penx/shared'
import { useReferralCode } from '../hooks/useReferralCode'

export const MyReferralLink = () => {
  const { data: code, isLoading, refetch } = useReferralCode()
  const { copy } = useCopyToClipboard()
  const myCode = code || 'waiting...'
  const url = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/believer-nft?ref=${myCode}`

  console.log('x=======data:', code, 'isLoading:', isLoading)

  useInterval(
    () => {
      refetch()
    },
    !code ? 2000 : null,
  )

  return (
    <Box bgGray100 border py3 px4 rounded2XL toBetween toCenterY fontBold my10>
      <Box>{url}</Box>
      <Box
        inlineFlex
        gray600
        cursorPointer
        onClick={() => {
          copy(url)
          toast.info('Copied to clipboard')
        }}
      >
        <Copy size={20} />
      </Box>
    </Box>
  )
}

export const MyReferralsModal = () => {
  return (
    <Modal name={ModalNames.MY_REFERRALS}>
      <ModalOverlay />
      <ModalContent w={['96%', 560]} px={[20, 32]} py20>
        <ModalCloseButton />
        <Box column gap4 textCenter>
          <Box column gapy4>
            <Box fontSemibold text2XL>
              My Referral Link
            </Box>
          </Box>

          <Box leadingNormal gray600 textLeft>
            <Box mb4>
              Share this link with other users. If someone mints a PenX believer
              NFT through this link:
            </Box>
            <Box as="ul" listInside column gap3>
              <Box as="li">you will receive 10% mint fee (ETH) reward.</Box>
              <Box as="li">They will get 10% discount on the mint fee.</Box>
            </Box>
          </Box>
          <MyReferralLink />
        </Box>
      </ModalContent>
    </Modal>
  )
}
