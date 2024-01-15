import { useMemo } from 'react'
import { Box } from '@fower/react'
import { useQuery } from '@tanstack/react-query'
import { Cloud, Copy } from 'lucide-react'
import { Button, Popover, PopoverContent, PopoverTrigger, toast } from 'uikit'
import { useNodeContext, useNodes } from '@penx/hooks'
import { Node } from '@penx/model'
import { INode } from '@penx/model-types'
import { NodeService } from '@penx/service'
import { useCopyToClipboard } from '@penx/shared'
import { store } from '@penx/store'
import { trpc } from '@penx/trpc-client'

export const PublishPopover = () => {
  const { node } = useNodeContext()

  if (!node?.id) return null

  return (
    <Popover placement="bottom-end">
      <PopoverTrigger asChild>
        <Button
          size={28}
          variant="light"
          colorScheme="gray400"
          px2
          py0
          textSM
          gray600
        >
          <Cloud size={16} />
          <Box>Publish</Box>
        </Button>
      </PopoverTrigger>

      <PopoverContent w-360 p4 column gap2>
        <Content node={node} />
      </PopoverContent>
    </Popover>
  )
}

interface ContentProps {
  node: Node
}
function Content({ node }: ContentProps) {
  const { copy } = useCopyToClipboard()
  const { nodeList } = useNodes()
  const url = process.env.NEXT_PUBLIC_NEXTAUTH_URL + `/s/${node?.id}`

  const { isLoading, data, refetch } = useQuery(['publish_node'], () =>
    trpc.node.getPublishedNode.query({
      nodeId: node.id,
      spaceId: node.spaceId,
    }),
  )

  if (isLoading) return null

  const isPublished = !!data

  return (
    <>
      <Box fontBold textLG mb2>
        {node.title}
      </Box>

      <Box textSM>Share URL</Box>
      <Box toBetween toCenterY bgGray100 rounded px1 py1 gap1>
        <Box flex-1 w={'calc(100% - 32px)'} truncate gray500>
          {url}
        </Box>
        <Button
          size={28}
          isSquare
          colorScheme="gray600"
          variant="ghost"
          gray400
          onClick={() => {
            copy(url)
            toast.info('Copied to clipboard')
          }}
        >
          <Copy />
        </Button>
      </Box>
      <Box
        toCenterY
        toRight
        gap2
        borderTop
        borderTopGray200
        mx--16
        py3
        px4
        mt4
        mb--16
      >
        <Button
          size="sm"
          colorScheme="white"
          onClick={async () => {
            let childrenNodes: INode[] = []

            if (node.isDatabase) {
              childrenNodes = store.node.find({
                where: { databaseId: node.id },
              })
            } else {
              childrenNodes = nodeList.flattenNode(node).map((n) => n.raw)
            }

            await trpc.node.publishNode.mutate({
              nodeId: node.id,
              spaceId: node.spaceId,
              nodesData: JSON.stringify([node.raw, ...childrenNodes]),
            })
            refetch()
          }}
        >
          Publish
        </Button>

        {isPublished && (
          <Button
            size="sm"
            colorScheme="white"
            red500--i
            onClick={async () => {
              //
            }}
          >
            unpublish
          </Button>
        )}
      </Box>
    </>
  )
}
