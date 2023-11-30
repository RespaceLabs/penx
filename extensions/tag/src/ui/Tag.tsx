import { Box } from '@fower/react'
import { useSelected } from 'slate-react'
import { Tooltip, TooltipContent, TooltipTrigger } from 'uikit'
import { ELEMENT_H5, ELEMENT_P } from '@penx/constants'
import { useEditorStatic } from '@penx/editor-common'
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

  const editor = useEditorStatic()

  const isInDatabase = (editor.children?.[0] as any)?.type === ELEMENT_P

  async function clickTag() {
    const database = await db.getNode(element.databaseId)
    if (database) {
      console.log('=====database:', database)

      store.node.selectNode(database)
    }
  }

  const tagJSX = (
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
      # {node.tagName}
    </Box>
  )

  const tagTooltip = (
    <Tooltip>
      <TooltipTrigger>{tagJSX}</TooltipTrigger>
      <TooltipContent shadow bgWhite black w-400 h-300>
        <Box gray500>Coming soon...</Box>
      </TooltipContent>
    </Tooltip>
  )

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
      {isInDatabase ? tagJSX : tagTooltip}
    </Box>
  )
}
