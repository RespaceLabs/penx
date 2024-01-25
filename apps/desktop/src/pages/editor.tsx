import { Box } from '@fower/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Button } from 'uikit'
import { trpc } from '@penx/trpc-client'
import { ClientOnly } from '~/components/ClientOnly'

export default function PageEditor() {
  const { push } = useRouter()
  const { isLoading, data } = trpc.space.mySpaces.useQuery()
  console.log('isLoading', isLoading, 'data', data)

  return (
    <>
      <ClientOnly>
        <Box>Editor</Box>
        <Button
          onClick={() => {
            push('/')
          }}
        >
          Home
        </Button>
      </ClientOnly>
    </>
  )
}
