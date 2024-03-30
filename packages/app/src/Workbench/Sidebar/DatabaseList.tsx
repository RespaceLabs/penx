import { Box } from '@fower/react'
import { TODO_DATABASE_NAME } from '@penx/constants'
import { useNodes } from '@penx/node-hooks'
import { store } from '@penx/store'

function getName(name: string) {
  if (name === TODO_DATABASE_NAME) return 'Todos'
  return name
}

export const DatabaseList = () => {
  const { nodeList } = useNodes()
  const nodes = nodeList.getDatabaseFavorites()

  if (!nodes.length) {
    // return (
    //   <Box px2 textXS gray400>
    //     No favorite tags
    //   </Box>
    // )
    return null
  }

  return (
    <Box mx2 mt1 mb2 column gap3 black>
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
              store.node.selectNode(node.raw)
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
            <Box text-15>{getName(node.raw.props.name!)}</Box>
            <Box h5 minW-20 neutral500 bgNeutral200 roundedFull textXS toCenter>
              {database.rows.length}
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}
