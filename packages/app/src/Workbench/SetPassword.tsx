import { useEffect, useRef, useState } from 'react'
import { Box } from '@fower/react'
import { Eye, EyeOff } from 'lucide-react'
import { Button, Input, InputElement, InputGroup, toast } from 'uikit'
import { RouterOutputs } from '@penx/api'
import { decryptString } from '@penx/encryption'
import { useSpaces } from '@penx/hooks'
import { db } from '@penx/local-db'
import { INode } from '@penx/model-types'
import { store } from '@penx/store'
import { getNodeMap } from '@penx/sync'
import { trpc } from '@penx/trpc-client'

type ServerNode = RouterOutputs['node']['listBySpaceId'][0]

export const SetPassword = () => {
  const { activeSpace } = useSpaces()
  const [password, setPassword] = useState('')
  const [visible, setVisible] = useState(false)
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
      const newNodeMap = getNodeMap(newNodes)

      await db.updateSpace(activeSpace.id, {
        password,
        nodeSnapshot: {
          version: activeSpace.pageSnapshot.version,
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

        <InputGroup>
          <Input
            type={visible ? 'text' : 'password'}
            placeholder="Enter the password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputElement gray500 h-100p toCenterY gap1 pr2>
            <Box
              cursorPointer
              scale-110--hover
              onClick={() => setVisible(!visible)}
            >
              {visible && <EyeOff size={16} />}
              {!visible && <Eye size={16} />}
            </Box>
          </InputElement>
        </InputGroup>
        <Box>
          <Button disabled={!password} onClick={syncToLocal}>
            Confirm and sync data to this device
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
