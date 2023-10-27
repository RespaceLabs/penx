import { useEffect, useState } from 'react'
import { Box } from '@fower/react'
import { Trans } from '@lingui/macro'
import { atom, useAtom } from 'jotai'
import { useAccount } from 'wagmi'
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
import { Snapshot } from '@penx/db'
import { useUser } from '@penx/hooks'
import { db } from '@penx/local-db'
import { store } from '@penx/store'
import { trpc } from '@penx/trpc-client'

const snapshotAtom = atom<Snapshot[]>([])

const useSnapshots = () => {
  const { address = '' } = useAccount()
  const [snapshots, setSnapshots] = useAtom(snapshotAtom)

  async function run() {
    const snapshots = await trpc.snapshot.listByAddress.query({ address })
    const spaces = await db.listSpaces()
    const set = new Set(spaces.map((space) => space.id))
    const data = snapshots.filter((snapshot) => !set.has(snapshot.spaceId))

    console.log('data', data)
    setSnapshots(data)
  }

  useEffect(() => {
    run()
  }, [])

  return { snapshots }
}

function SyncItem({ spaceId }: { spaceId: string }) {
  async function sync() {
    const space = await db.getSpace(spaceId)
    if (space) return
    await store.createSpace({
      name: spaceId,
      id: spaceId,
    })
  }
  return (
    <Box toCenterY toBetween gap3>
      <Box>{spaceId}</Box>
      <Button colorScheme="white" onClick={sync}>
        <Trans>Sync</Trans>
      </Button>
    </Box>
  )
}

const Content = () => {
  const { snapshots } = useSnapshots()
  return (
    <Box gap3>
      <ModalHeader mb2>
        <Trans>Detect {snapshots.length} to sync</Trans>
      </ModalHeader>
      <Box column gap3>
        {snapshots.map((snapshot) => (
          <SyncItem key={snapshot.id} spaceId={snapshot.spaceId}></SyncItem>
        ))}
      </Box>
    </Box>
  )
}

export const SyncDetectorModal = () => {
  const { snapshots } = useSnapshots()
  if (!snapshots.length) return null
  return (
    <Modal name={ModalNames.SYNC_DETECTOR} isOpen closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent w={[500]} column gap4 toCenterX>
        <ModalCloseButton />

        <Content />
      </ModalContent>
    </Modal>
  )
}
