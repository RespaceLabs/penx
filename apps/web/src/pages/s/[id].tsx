import { FC, PropsWithChildren } from 'react'
import { Box } from '@fower/react'
import { GetServerSideProps } from 'next'
import { PublishedTableView } from '@penx/database'
import { prisma, PublishedNode } from '@penx/db'
import { ReadOnlyEditor } from '@penx/editor'
import { INode } from '@penx/model-types'
import { nodeToSlate } from '@penx/serializer'
import { ClientOnly } from '~/components/ClientOnly'

interface Props {
  nodeId: string
  publishedNode: PublishedNode
}

export default function PagePublishedNode({ nodeId, publishedNode }: Props) {
  if (!publishedNode) return <Box>404</Box>

  const nodes = publishedNode.nodes as unknown as INode[]
  const node = nodes.find(({ id }) => id === nodeId)!
  const content = nodeToSlate(node, nodes, false)

  console.log('=====node:', nodes)

  if (node.type === 'DATABASE') {
    return (
      <ClientOnly>
        <PublishedTableView nodes={nodes} />
      </ClientOnly>
    )
  }

  // TODO: handle ClientOnly
  return (
    <Box>
      <ClientOnly>
        <Box w-760 mx-auto mt10>
          <ReadOnlyEditor content={content} nodes={nodes} />
        </Box>
      </ClientOnly>
    </Box>
  )
}

export const getServerSideProps: GetServerSideProps = async function (context) {
  const id = context.query?.id as string
  const publishedNode = await prisma.publishedNode.findUnique({
    where: { nodeId: id },
    select: {
      id: true,
      nodes: true,
      updatedAt: true,
      createdAt: true,
    },
  })

  if (publishedNode) {
    publishedNode.createdAt = publishedNode.createdAt.toISOString() as any
    publishedNode.updatedAt = publishedNode.updatedAt.toISOString() as any
  }

  return {
    props: {
      nodeId: id,
      publishedNode,
    },
  }
}
