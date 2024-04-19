import { useState } from 'react'
import { Box } from '@fower/react'
import { useQuery } from '@tanstack/react-query'
import { Modal, ModalContent, ModalOverlay } from 'uikit'
import { ModalNames } from '@penx/constants'
import { db } from '@penx/local-db'
import { IDatabaseNode } from '@penx/model-types'
import { TagHubContent } from './TagHubContent'
import { TagHubSidebar } from './TagHubSidebar'

function Content() {
  const { isLoading, data } = useQuery({
    queryKey: ['tag-templates'],
    queryFn: async () => {
      const localSpaces = await db.listLocalSpaces()
      if (!localSpaces.length) return []
      const localSpace = localSpaces[0]
      const nodes = await db.listDatabaseBySpace(localSpace.id)
      return nodes
        .filter((node) => node.props.name.startsWith('$template__'))
        .sort((a, b) =>
          a.props.name
            .replace('$template__', '')
            .localeCompare(b.props.name.replace('$template__', '')),
        )
    },
  })

  if (isLoading) return <Box></Box>

  if (!data) return null

  if (!data.length) return null

  return <InnerContent databases={data} />
}

interface InnerContentProps {
  databases: IDatabaseNode[]
}
function InnerContent({ databases }: InnerContentProps) {
  const [database, setDatabase] = useState(databases[0])
  return (
    <>
      <TagHubSidebar
        databases={databases}
        activeDatabase={database}
        onSelect={setDatabase}
      />
      <TagHubContent database={database} />
    </>
  )
}

export const TagHubModal = () => {
  return (
    <Modal name={ModalNames.TAG_HUB}>
      <ModalOverlay />
      <ModalContent
        w={['100%', '100%', '90%', 1000, 1200]}
        mx-auto
        toBetween
        p0--i
        // h={['100%', '100%', 800]}
        h={[760]}
        flexDirection={['column', 'column', 'row']}
        overflowHidden
      >
        {/* <ModalCloseButton /> */}
        <Content></Content>
      </ModalContent>
    </Modal>
  )
}
