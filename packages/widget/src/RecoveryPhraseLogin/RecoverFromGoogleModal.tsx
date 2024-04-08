import { Dispatch, SetStateAction, useState } from 'react'
import { Box } from '@fower/react'
import {
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalTrigger,
} from 'uikit'
import { RecoverFromGoogleForm } from './RecoverFromGoogleForm'

interface Props {
  setMnemonic: Dispatch<SetStateAction<string>>
}

export const RecoverFromGoogleModal = ({ setMnemonic }: Props) => {
  return (
    <Modal>
      <ModalOverlay />
      <ModalTrigger>
        <Button
          variant="light"
          size="lg"
          colorScheme="gray500"
          w-200
          rounded3XL
          column
          gap-2
        >
          <Box textSM>Restore recovery phrase</Box>
          <Box text-10>Recover from google drive</Box>
        </Button>
      </ModalTrigger>
      <ModalContent w={['100%', 500]} column gap4>
        <ModalCloseButton />

        <ModalHeader mb2>Google drive backup password</ModalHeader>

        <RecoverFromGoogleForm setMnemonic={setMnemonic} />
      </ModalContent>
    </Modal>
  )
}
