import { useEffect, useRef, useState } from 'react'
import { Box } from '@fower/react'
import { node } from 'slate'
import { Button, Input, toast } from 'uikit'
import { RouterOutputs } from '@penx/api'
import { decryptString } from '@penx/encryption'
import { useSpaces } from '@penx/hooks'
import { db } from '@penx/local-db'
import { Node } from '@penx/model'
import { INode, ISpace } from '@penx/model-types'
import { store } from '@penx/store'
import { trpc } from '@penx/trpc-client'

type ServerNode = RouterOutputs['node']['listBySpaceId'][0]

function getNodeMap(nodes: INode[], space: ISpace) {
  return nodes.reduce(
    (acc, cur) => {
      const node = new Node(cur)
      return {
        ...acc,
        [node.id]: node.toHash(space.encrypted, space.password),
      }
    },
    {} as Record<string, string>,
  )
}

export const SetPassword = () => {
  const { activeSpace } = useSpaces()
  const [password, setPassword] = useState('')
  const nodesRef = useRef<ServerNode[]>([])

  useEffect(() => {
    trpc.node.listBySpaceId.query({ spaceId: activeSpace.id }).then((data) => {
      // console.log('======data:', data)
      nodesRef.current = data
    })
  }, [activeSpace.id])

  async function syncToLocal() {
    // fallback
    if (!nodesRef.current.length) {
      nodesRef.current = await trpc.node.listBySpaceId.query({
        spaceId: activeSpace.id,
      })
    }

    try {
      for (const item of nodesRef.current) {
        if (!activeSpace.encrypted) {
          await db.createNode(item as any as INode)
        } else {
          await db.createNode({
            ...item,
            element: JSON.parse(
              decryptString(item.element as string, password),
            ),
            props: JSON.parse(decryptString(item.props as string, password)),
          } as INode)
        }
      }

      const newNodes = await db.listNodesBySpaceId(activeSpace.id)
      const newNodeMap = getNodeMap(newNodes, {
        ...activeSpace.raw,
        password,
      })

      await db.updateSpace(activeSpace.id, {
        password,
        nodeSnapshot: {
          version: activeSpace.snapshot.version,
          nodeMap: newNodeMap,
        },
      })

      store.space.selectSpace(activeSpace.id)
    } catch (error) {
      console.log('==============error:', error)
      toast.error('Password incorrect')
    }
  }

  return (
    <Box p6 toCenter minH-80vh>
      <Box column gap4 w={['90%', '90%', 600]}>
        <Box fontMedium textXL>
          End-to-End password of space "{activeSpace.name}"
        </Box>

        <Box textSM gray400 leadingSnug>
          We never store your password on our servers at any time, so you will
          need to enter your password on the new device to sync data.
        </Box>
        <Input
          placeholder="Enter the password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Box>
          <Button disabled={!password} onClick={syncToLocal}>
            Confirm and sync data to this device
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
