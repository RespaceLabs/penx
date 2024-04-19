import { Box } from '@fower/react'
import {
  Button,
  Modal,
  ModalClose,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useModalContext,
} from 'uikit'
import { ModalNames } from '@penx/constants'
import { IColumnNode } from '@penx/model-types'
import { ColumnMenu } from './ColumnMenu/ColumnMenu'

interface ColumnConfigModalData {
  index?: number
  column: IColumnNode
}

const Footer = () => {
  const { data, close } = useModalContext<ColumnConfigModalData>()
  return (
    <Box>
      <ColumnMenu index={data.index} column={data.column} close={close} />
    </Box>
  )
}

export const ConfigColumnModal = () => {
  return (
    <Modal name={ModalNames.CONFIG_COLUMN}>
      <ModalOverlay />

      <ModalContent w={['100%', 500]} column>
        <ModalCloseButton />
        <ModalHeader>Configure Column</ModalHeader>
        <Footer />
      </ModalContent>
    </Modal>
  )
}
