import React from 'react'
import { Box } from '@fower/react'
import { useQuery } from '@tanstack/react-query'
import ky from 'ky'
import { Button } from 'uikit'
import { api } from '~/utils/api'

type Manifest = {
  name: string
  id: string
  version: string
  main: string
}

export const PluginDevelop = () => {
  const { isLoading, data: manifest } = useQuery<any, any, Manifest>(
    ['manifest'],
    () => ky.get('http://localhost:5001/manifest.json').json(),
  )

  const { isLoading: isLoadingCode, data: code } = useQuery<any, any, string>(
    ['code'],
    () => ky.get('http://localhost:5001/code').text(),
  )

  const { data: spaces } = api.space.all.useQuery()
  console.log('spaces:', spaces)

  const { mutate } = api.extension.publishExtension.useMutation()

  if (isLoading || isLoadingCode) return null

  // console.log('data: ', manifest, 'code: ', code)

  return (
    <Box>
      <pre>{JSON.stringify(manifest, null, 2)}</pre>
      <Button
        mt4
        onClick={() => {
          mutate({
            uniqueId: manifest!.id,
            name: manifest!.name,
            version: manifest!.version,
            code: code!,
          })
        }}
      >
        Publish Extension
      </Button>
    </Box>
  )
}
