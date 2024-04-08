import { Box } from '@fower/react'
import { Button, Input } from 'uikit'
import { useBulletDrawer } from '@penx/hooks'
import { Node } from '@penx/model'
import { useDatabaseNodes } from '@penx/node-hooks'

export const AddTag = () => {
  const { close, node } = useBulletDrawer()
  const nodes = useDatabaseNodes()

  return (
    <Box mx--8 pt4 px3>
      <Box textXS gray400 mb2>
        <Box toCenterY gap1>
          <Input placeholder="Search or add a tag" flex-1 />
          <Button colorScheme="black">Add</Button>
        </Box>
      </Box>
      <Box toCenterY gap2 flexWrap>
        {nodes.map((item) => {
          const node = new Node(item)
          if (node.isTodoDatabase) return null
          return (
            <Box
              key={item.id}
              toCenterY
              textXS
              gray400
              roundedFull
              py-6
              px3
              bg--T92={node?.tagColor}
              bg--T88--hover={node?.tagColor}
              color={node?.tagColor}
              color--D4--hover={node?.tagColor}
              // onClick={() => onSelect(node)}
            >
              #{node.tagName}
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
