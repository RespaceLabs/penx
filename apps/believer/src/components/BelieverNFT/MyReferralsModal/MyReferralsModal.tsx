import { useInterval } from 'react-use'
import { Box } from '@fower/react'
import { Copy, Pen } from 'lucide-react'
import {
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  modalController,
  ModalOverlay,
  toast,
  useModalContext,
} from 'uikit'
import { ModalNames } from '@penx/constants'
import { sleep, useCopyToClipboard } from '@penx/shared'
import { useReferralCode } from '../hooks/useReferralCode'

export const MyReferralLink = () => {
  const { data: code, isLoading, refetch } = useReferralCode()
  const { copy } = useCopyToClipboard()
  const myCode = code || 'waiting...'
  const url = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/believer-nft?ref=${myCode}`

  useInterval(() => refetch, !code ? 2000 : null)

  return (
    <Box bgGray100 border py3 px4 rounded2XL toBetween toCenterY fontBold my10>
      <Box>{url}</Box>
      <Box toCenterY gap-1>
        <Button
          size="sm"
          isSquare
          variant="ghost"
          colorScheme="gray600"
          onClick={() => {
            copy(url)
            toast.info('Copied to clipboard')
          }}
        >
          <Copy size={20} />
        </Button>
        <Button
          size="sm"
          isSquare
          variant="ghost"
          colorScheme="gray600"
          onClick={async () => {
            modalController.close(ModalNames.MY_REFERRALS)
            await sleep(200)
            modalController.open(ModalNames.GENERATE_REFERRAL_CODE, {
              loading: false,
              code: myCode,
            })
          }}
        >
          <Pen size={20} />
        </Button>
      </Box>
    </Box>
  )
}

export const MyReferralsModal = () => {
  return (
    <Modal name={ModalNames.MY_REFERRALS}>
      <ModalOverlay />
      <ModalContent w={['100%', 560]} px={[20, 32]} py20>
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
