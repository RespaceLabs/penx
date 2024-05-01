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
import { DatabaseProvider } from '@penx/database-context'
import { RowForm } from '@penx/database-ui'
import { Node } from '@penx/model'

interface Data {
  node: Node
  databaseId: string
}

const Content = () => {
  const {
    data: { node, databaseId },
  } = useModalContext<Data>()
  // console.log('======node:', node)

  return (
    <Box>
      <ModalHeader mb2># {node.tagName}</ModalHeader>
      <DatabaseProvider databaseId={databaseId}>
        <RowForm rowId={node.props.rowId} databaseId={databaseId} />
      </DatabaseProvider>
    </Box>
  )
}

export const RowModal = () => {
  return (
    <Modal name={ModalNames.ROW}>
      <ModalOverlay />
      <ModalContent w={['100%', 500]} column gap4>
        <ModalCloseButton />

        <Content />
      </ModalContent>
    </Modal>
  )
}
