import { useCallback } from 'react'
import { Box } from '@fower/react'
import { Editor, Node, Path, Transforms } from 'slate'
import { ELEMENT_TAG } from '@penx/constants'
import { PenxEditor, useEditorStatic } from '@penx/editor-common'
import { findNodePath, getNodeByPath } from '@penx/editor-queries'
import { useNodes } from '@penx/hooks'
import { db } from '@penx/local-db'
import { INode } from '@penx/model-types'
import { store } from '@penx/store'
import { TagElement, TagSelectorElement } from '../../types'
import { useKeyDownList } from '../../useKeyDownList'
import { TagSelectorItem } from './TagSelectorItem'

interface Props {
  close: any
  element: TagSelectorElement
  containerRef: any
}

function getSearchText(editor: PenxEditor, element: TagSelectorElement) {
  let text = Node.string(element)

  // TODO: need improvement
  if (editor.selection?.focus?.path) {
    const focusedNode = getNodeByPath(editor, editor.selection!.focus!.path)!
    const focusedNodeText = Node.string(focusedNode)
    if (focusedNodeText !== text) {
      text = text + focusedNodeText
    }
  }

  return text
}

export const TagSelectorContent = ({ close, element }: Props) => {
  const editor = useEditorStatic()
  const { nodeList } = useNodes()
  const tagNames = nodeList.tagNodes.map((node) => node.props.name!)

  const text = getSearchText(editor, element)

  const filteredTypes = tagNames.filter((item) => {
    const q = text.replace(/^#/, '').toLowerCase()
    if (!q) return true
    return item.toLowerCase().includes(q)
  })

  // console.log('=====element:', element, text)

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

      // TODO: HACK, for not english text
      if (editor.selection?.focus?.path) {
        const node = getNodeByPath(editor, editor.selection!.focus!.path)!
        const text = Node.string(node)

        if (text?.length) {
          Transforms.removeNodes(editor, { at: editor.selection.focus.path })
          Editor.insertNode(editor, { text: '' })
        }
      }

      // focus to next node
      const nextNode = getNodeByPath(editor, Path.next(path))!
      if (nextNode) {
        Transforms.select(editor, Editor.start(editor, Path.next(path)))
      }

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
      <Box py3 px3 textSM>
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
