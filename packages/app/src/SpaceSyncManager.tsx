import { FC, PropsWithChildren, useEffect, useRef, useState } from 'react'
import { Box } from '@fower/react'
import { useQuery } from '@tanstack/react-query'
import { db } from '@penx/local-db'
import { store } from '@penx/store'
import { api } from '@penx/trpc-client'
import { CreateFirstSpaceForm } from './Workbench/CreateFirstSpaceForm/CreateFirstSpaceForm'

interface Props {
  userId: string
}

export const SpaceSyncManager = ({
  children,
  userId,
}: PropsWithChildren<Props>) => {
  const { isLoading, data = [] } = useQuery(['spaces', userId], async () => {
    let localSpaces = await db.listSpaces(userId)
    if (localSpaces.length) return localSpaces

    const remoteSpaces = await api.space.mySpaces.query()
    console.log('======remoteSpaces:', remoteSpaces)

    for (const space of remoteSpaces) {
      await db.createSpace(space as any, false)
    }

    const spaces = await db.listSpaces()

    return spaces
  })

  useEffect(() => {
    if (data) {
      store.space.setSpaces(data)
    }
  }, [data])

  if (isLoading) return null

  if (!data.length) {
    return (
      <Box h-90vh toCenter>
        <CreateFirstSpaceForm />
      </Box>
    )
  }

  return <>{children}</>
}
