import { Box } from '@fower/react'
import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useModalContext,
} from 'uikit'
import { ModalNames } from '@penx/constants'
import { GenerateReferralCodeForm } from './GenerateReferralCodeForm'
import { GenerateCodeModalData } from './useGenerateReferralCodeForm'

function Content() {
  const { data } = useModalContext<GenerateCodeModalData>()
  return (
    <Box>
      <Box column gap5 textCenter mb5>
        <Box column gapy4>
          <Box fontSemibold text2XL>
            {data?.code ? 'Update Referral Code' : 'Generate Referral Code'}
          </Box>
        </Box>
        {data?.code && (
          <Box>
            Update your referral code to share, and start earning rewards
          </Box>
        )}
        {!data?.code && (
          <Box>
            Looks like you don{`'`}t have a referral code to share. Create one
            now and start earning rewards
          </Box>
        )}
      </Box>
      <GenerateReferralCodeForm />
    </Box>
  )
}

export const GenerateReferralCodeModalModal = () => {
  return (
    <Modal name={ModalNames.GENERATE_REFERRAL_CODE} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent w={['96%', 560]} px={[20, 32]} py20>
        <ModalCloseButton />
        <Content></Content>
      </ModalContent>
    </Modal>
  )
}
