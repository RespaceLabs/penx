import { Box } from '@fower/react'
import { useSelected } from 'slate-react'
import { ElementProps } from '@penx/extension-typings'
import { useNodes } from '@penx/hooks'
import { db } from '@penx/local-db'
import { store } from '@penx/store'
import { TagElement } from '../types'

export const Tag = ({
  element,
  attributes,
  children,
}: ElementProps<TagElement>) => {
  let selected = useSelected()
  const { nodeList } = useNodes()
  const node = nodeList.nodeMap.get(element.databaseId)!

  async function clickTag() {
    const database = await db.getDatabaseByName(element.name)
    if (database) {
      console.log('=====database:', database)

      store.selectNode(database)
    }
  }

  return (
    <Box
      {...attributes}
      toCenterY
      inlineFlex
      bgGray100
      rounded
      overflowHidden
      ringBrand500={selected}
      contentEditable={false}
    >
      {children}
      <Box
        contentEditable={false}
        cursorPointer
        fontNormal
        py1
        px1
        textXS
        bg--T92={node?.tagColor}
        bg--T88--hover={node?.tagColor}
        color={node?.tagColor}
        color--D4--hover={node?.tagColor}
        onClick={clickTag}
      >
        # {element.name || node?.tagName}
      </Box>
    </Box>
  )
}
