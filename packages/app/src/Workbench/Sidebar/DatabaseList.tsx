import { Box } from '@fower/react'
import { TODO_DATABASE_NAME } from '@penx/constants'
import { useDatabaseNodes } from '@penx/node-hooks'
import { store } from '@penx/store'
import { TagsEntry } from './TagsEntry'

function getName(name: string) {
  if (name === TODO_DATABASE_NAME) return 'Todos'
  return name
}

export const DatabaseList = () => {
  const nodes = useDatabaseNodes()

  return (
    <Box>
      <TagsEntry />
      <Box mx2 mt2 column gap3 black>
        {nodes.map((node) => {
          const color = node.props.color || 'gray800'
          const t0 = Date.now()
          const database = store.node.getDatabase(node.id)
          const t1 = Date.now()

          return (
            <Box
              key={node.id}
              cursorPointer
              toCenterY
              gap1
              leadingNone
              onClick={() => {
                store.node.selectNode(node)
              }}
            >
              <Box
                toCenter
                color={color}
                textXS
                square5
                roundedFull
                bg--T90={color}
              >
                #
              </Box>
              <Box text-15>{getName(node.props.name)}</Box>
              <Box
                h5
                minW-20
                neutral500
                bgNeutral200
                roundedFull
                textXS
                toCenter
              >
                {database.rows.length}
              </Box>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
