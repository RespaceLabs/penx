import { Box } from '@fower/react'
import { Modal, ModalCloseButton, ModalContent, ModalOverlay } from 'uikit'
import { ModalNames } from '@penx/constants'
import { GenerateReferralCodeForm } from './GenerateReferralCodeForm'

export const GenerateReferralCodeModalModal = () => {
  return (
    <Modal name={ModalNames.GENERATE_REFERRAL_CODE} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent w={['96%', 560]} px={[20, 32]} py20>
        <ModalCloseButton />
        <Box column gap4 textCenter>
          <Box column gapy4>
            <Box fontSemibold text2XL>
              Generate Referral Code
            </Box>
          </Box>
          <Box>
            Looks like you don{`'`}t have a referral code to share. Create one
            now and start earning rewards
          </Box>
        </Box>
        <GenerateReferralCodeForm />
      </ModalContent>
    </Modal>
  )
}
