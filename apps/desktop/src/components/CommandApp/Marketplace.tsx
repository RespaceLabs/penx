import { Box, styled } from '@fower/react'
import { useMutation } from '@tanstack/react-query'
import { Command } from 'cmdk'
import { Button, Skeleton, Spinner } from 'uikit'
import { RouterOutputs } from '@penx/api'
import { db } from '@penx/local-db'
import { Manifest } from '@penx/model'
import { trpc } from '@penx/trpc-client'
import { fetchInstallationJSON } from '~/common/fetchInstallationJSON'
import { ListItemIcon } from '../ListItemIcon'

const StyledCommandList = styled(Command.List)
const StyledCommandItem = styled(Command.Item)

interface ExtensionItemProps {
  item: RouterOutputs['extension']['all'][0]
}

function ExtensionItem({ item }: ExtensionItemProps) {
  const manifest = new Manifest(item.manifest as any)

  const { mutateAsync, isLoading } = useMutation({
    mutationKey: ['extension', item.id],
    mutationFn: async () => {
      const json = await fetchInstallationJSON(manifest.id)
      if (json) {
        const { id: slug, ...data } = json
        await db.upsertExtension(slug, data as any)
      }
    },
  })

  return (
    <StyledCommandItem
      key={item.id}
      cursorPointer
      toCenterY
      toBetween
      px2
      h-64
      gap2
      roundedLG
      black
      value={item.id}
      onSelect={() => {}}
      onClick={() => {}}
    >
      <Box toCenterY gap2>
        <ListItemIcon icon={item.logo as string} />
        <Box column>
          <Box textSM>{manifest.name}</Box>
          <Box text-13 gray400>
            {manifest.description}
          </Box>
        </Box>
      </Box>

      <Button
        colorScheme="black"
        size="sm"
        disabled={isLoading}
        onClick={() => {
          mutateAsync()
        }}
      >
        {isLoading && <Spinner white />}
        <Box>Install</Box>
      </Button>
    </StyledCommandItem>
  )
}

export function Marketplace() {
  const { data = [], isLoading } = trpc.extension.all.useQuery()

  if (isLoading)
    return (
      <Box flex-1 p2 column gap1>
        <Skeleton h-64 />
        <Skeleton h-64 />
        <Skeleton h-64 />
      </Box>
    )

  return (
    <StyledCommandList flex-1 p2>
      <Command.Group>
        {data?.map((item) => <ExtensionItem key={item.id} item={item} />)}
      </Command.Group>
    </StyledCommandList>
  )
}
