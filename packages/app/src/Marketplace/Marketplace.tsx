import { Box } from '@fower/react'
import { useQuery } from '@tanstack/react-query'
import { trpc } from '@penx/trpc-client'
import { ExtensionItem } from './ExtensionItem'

export function Marketplace() {
  const { data, isLoading } = useQuery(['marketplace'], () =>
    trpc.extension.all.query(),
  )

  if (isLoading || !data) return null

  return (
    <Box>
      {data.map((extension) => (
        <ExtensionItem key={extension.id} extension={extension} />
      ))}
    </Box>
  )
}
