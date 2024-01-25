import { Box } from '@fower/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Button } from 'uikit'
import { ClientOnly } from '~/components/ClientOnly'

export default function PageEditor() {
  const { push } = useRouter()
  return (
    <>
      <Head>
        <title>PenX</title>
      </Head>
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
