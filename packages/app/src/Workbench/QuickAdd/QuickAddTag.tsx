import { Box } from '@fower/react'
import { Node } from '@penx/model'
import { useDatabaseNodes } from '@penx/node-hooks'

interface Props {
  onSelect: (node: Node) => void
}

export const QuickAddTag = ({ onSelect }: Props) => {
  const nodes = useDatabaseNodes()
  return (
    <Box borderTop borderGray200--T40 mx--8 pt4 px3>
      <Box textXS gray400 mb2>
        Quick add a tag:
      </Box>
      <Box toCenterY gap2 flexWrap>
        {nodes.map((item) => {
          const node = new Node(item)
          if (node.isTodoDatabase || node.isFileDatabase) return null
          if (node.tagName.startsWith('$template__')) return null
          return (
            <Box
              key={item.id}
              toCenterY
              textSM
              gray400
              roundedFull
              py-6
              px3
              // bg--T92={node?.tagColor}
              bgNeutral100
              // bg--T88--hover={node?.tagColor}
              // color={node?.tagColor}
              // color--D4--hover={node?.tagColor}
              onClick={() => onSelect(node)}
            >
              #{node.tagName}
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
