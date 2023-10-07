import React from 'react'
import { Box } from '@fower/react'
import { useQuery } from '@tanstack/react-query'
import ky from 'ky'
import { Button } from 'uikit'
import { api } from '~/utils/api'

type Extension = {
  name: string
  id: string
  version: string
  main: string
  code: string
  description: string
}

export const ExtensionDevelop = () => {
  const { isLoading, data: extension } = useQuery<any, any, Extension>(
    ['manifest'],
    () => ky.get('http://localhost:5001/extension').json(),
  )

  const { mutate } = api.extension.publishExtension.useMutation()

  if (isLoading) return null

  return (
    <Box>
      <pre>{JSON.stringify(extension, null, 2)}</pre>
      <Button
        mt4
        onClick={() => {
          mutate({
            uniqueId: extension!.id,
            name: extension!.name,
            version: extension!.version,
            code: extension?.code!,
            description: extension?.description!,
          })
        }}
      >
        Publish Extension
      </Button>
    </Box>
  )
}
