import { Box } from '@fower/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Spinner } from 'uikit'
import { db } from '@penx/local-db'
import { IExtension } from '@penx/model-types'

interface ExtensionItemProps {
  extension: IExtension
}

function useExtensions() {
  return useQuery(['extensions'], () => db.listExtensions())
}

function ExtensionItem({ extension }: ExtensionItemProps) {
  const { refetch } = useExtensions()
  const { mutateAsync, isLoading } = useMutation(
    ['extension', extension.id],
    () => db.deleteExtension(extension.id),
  )
  return (
    <Box toCenterY toBetween>
      <Box fontSemibold>{extension.name}</Box>
      <Button
        size="sm"
        colorScheme="white"
        disabled={isLoading}
        gap1
        onClick={async () => {
          await mutateAsync()
          refetch()
        }}
      >
        {isLoading && <Spinner />}
        <Box>Uninstall</Box>
      </Button>
    </Box>
  )
}

export const PageExtensions = () => {
  const { data = [] } = useExtensions()
  return (
    <Box px={[20, 20]} py={[0, 0, 40]}>
      <Box mx-auto pb6 column gap3>
        <Box fontBold text4XL>
          Extensions
        </Box>
      </Box>
      <Box column gap2>
        {data.map((extension) => {
          return <ExtensionItem key={extension.id} extension={extension} />
        })}
      </Box>
    </Box>
  )
}
