import { useCallback } from 'react'
import { Box } from '@fower/react'
import { Editor, Node, Path, Transforms } from 'slate'
import { ELEMENT_TAG } from '@penx/constants'
import { useEditorStatic } from '@penx/editor-common'
import { findNodePath } from '@penx/editor-queries'
import { useNodes } from '@penx/hooks'
import { db } from '@penx/local-db'
import { INode } from '@penx/model-types'
import { store } from '@penx/store'
import { TagElement } from '../../types'
import { useKeyDownList } from '../../useKeyDownList'
import { TagSelectorItem } from './TagSelectorItem'

interface Props {
  close: any
  element: any
  containerRef: any
}

export const TagSelectorContent = ({ close, element }: Props) => {
  const editor = useEditorStatic()
  const { nodeList } = useNodes()
  const tagNames = nodeList.tagNodes.map((node) => node.props.name!)

  const filteredTypes = tagNames.filter((item) => {
    const q = Node.string(element).replace(/^#/, '').toLowerCase()
    if (!q) return true
    return item.toLowerCase().includes(q)
  })

  const text = Node.string(element)
  const tagName = text.replace(/^#/, '')

  const selectTag = useCallback(
    (tagName: any, databaseId: string) => {
      const path = findNodePath(editor, element)!

      Transforms.setNodes<TagElement>(
        editor,
        {
          type: ELEMENT_TAG,
          name: tagName,
          databaseId,
        },
        { at: path },
      )

      Transforms.select(editor, Editor.end(editor, Path.parent(path)))

      setTimeout(() => {
        close()
      }, 0)
    },
    [editor, close, element],
  )

  const listItemIdPrefix = 'type-list-item-'

  const { cursor } = useKeyDownList({
    onEnter: async (cursor) => {
      let database: INode
      if (!filteredTypes.length) {
        database = await store.node.createDatabase(tagName)
        selectTag(tagName, database.id)
      } else {
        const name = filteredTypes[cursor]
        database = await db.getDatabaseByName(name)
        selectTag(name, database.id)
      }

      setTimeout(() => {
        editor.isTagSelectorOpened = false
      }, 50)
    },
    listLength: filteredTypes.length,
    listItemIdPrefix,
  })

  if (!filteredTypes.length) {
    return (
      <Box py3 px3>
        Create tag "{text}"
      </Box>
    )
  }

  return (
    <Box column gapY-1>
      {filteredTypes.map((name, i) => {
        return (
          <TagSelectorItem
            key={name}
            id={listItemIdPrefix + i}
            name={name}
            isActive={i === cursor}
            onClick={async () => {
              const name = filteredTypes[cursor]
              const database = await db.getDatabaseByName(name)
              selectTag(name, database.id)
            }}
          />
        )
      })}
    </Box>
  )
}
