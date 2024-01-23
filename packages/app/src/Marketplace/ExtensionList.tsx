import { useEffect } from 'react'
import { Box } from '@fower/react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@penx/trpc-client'
import { ExtensionItem } from './ExtensionItem'
import { useExtension } from './hooks/useExtension'

export function ExtensionList() {
  const { extension, setExtension } = useExtension()
  const { data, isLoading } = useQuery(
    ['marketplace'],
    () => api.extension.all.query() as any,
  )

  useEffect(() => {
    if (!data) return
    setExtension(data[0])
  }, [data, setExtension])

  if (isLoading || !data) return null

  return (
    <Box column gap2 p3>
      {data.map((item: any) => (
        <ExtensionItem
          key={item.id}
          extension={item}
          selected={item.id === extension.id}
        />
      ))}
    </Box>
  )
}
