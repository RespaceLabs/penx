import { Box } from '@fower/react'
import { BoxIcon } from 'lucide-react'
import { IDatabaseNode } from '@penx/model-types'

interface Props {
  activeDatabase: IDatabaseNode
  databases: IDatabaseNode[]
  onSelect: (database: IDatabaseNode) => void
}

export const TagHubSidebar = ({
  databases,
  activeDatabase,
  onSelect,
}: Props) => {
  return (
    <Box column w={['100%', '100%', 260]} bgGray100 p6 flexShrink-0>
      <Box toCenterY gap1 mb4>
        <Box inlineFlex gray600>
          <BoxIcon size={20} />
        </Box>
        <Box textLG fontMedium>
          Templates
        </Box>
      </Box>
      <Box gap-1 column neutral600>
        {databases.map((item) => {
          const isActive = item.id === activeDatabase.id
          return (
            <Box
              key={item.id}
              toCenterY
              gap2
              cursorPointer
              bgNeutral200={isActive}
              black={isActive}
              fontSemibold={isActive}
              roundedLG
              mx--12
              px3
              py2
              onClick={() => {
                onSelect(item)
              }}
            >
              <Box color={item.props.color}>#</Box>
              <Box>{item.props.name.replace('$template__', '')}</Box>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
