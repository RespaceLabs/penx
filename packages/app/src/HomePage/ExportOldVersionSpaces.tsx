import { useEffect, useState } from 'react'
import { Box } from '@fower/react'
import {
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalTrigger,
} from 'uikit'
import { db } from '@penx/local-db'
import { ISpace } from '@penx/model-types'
import { ExportBtn } from '../components/ExportBtn'

export function ExportOldVersionSpaces() {
  const [loading, setLoading] = useState(true)
  const [spaces, setSpaces] = useState<ISpace[]>([])

  async function run() {
    if (!db.database.connection) {
      await db.database.connect()
    }

    db.listSpaces().then((spaces) => {
      setSpaces(
        spaces.filter(
          (space) => Reflect.has(space, 'isCloud') && !(space as any).isCloud,
        ),
      )
      setLoading(false)
    })
  }

  useEffect(() => {
    run()
  }, [])

  if (loading) return null

  if (!spaces.length) return null

  return (
    <Modal>
      <ModalOverlay />
      <ModalTrigger>
        <Button colorScheme="white" size="lg" roundedFull>
          Export old version local spaces
        </Button>
      </ModalTrigger>
      <ModalContent w={['96%', 600]} px={[20, 32]} py20 minH-400 column gap4>
        <ModalCloseButton />
        <Box text2XL fontBold>
          Export old version spaces
        </Box>
        <Box leadingSnug gray400>
          PenX Sync is nearly stable now, pure local spaces is not supported
          now. Please export old pure local spaces and import it as cloud
          spaces.
        </Box>

        <Box column gap4>
          {spaces.map((space) => (
            <Box key={space.id} toCenterY toBetween gap2>
              <Box>{space.name}</Box>
              <ExportBtn space={space}>Export</ExportBtn>
            </Box>
          ))}
        </Box>
      </ModalContent>
    </Modal>
  )
}
