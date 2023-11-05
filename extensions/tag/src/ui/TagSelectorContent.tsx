import { useCallback } from 'react'
import { Box } from '@fower/react'
import { Editor, Node, Path, Transforms } from 'slate'
import { TElement, useEditorStatic } from '@penx/editor-common'
import { findNodePath } from '@penx/editor-queries'
import { useNodes } from '@penx/hooks'
import { store } from '@penx/store'
import { ELEMENT_TAG } from '../constants'
import { TagElement } from '../types'
import { useKeyDownList } from '../useKeyDownList'
import { TagSelectorItem } from './TagSelectorItem'

interface Props {
  close: any
  element: any
  containerRef: any
}

export const TagSelectorContent = ({ close, element }: Props) => {
  const editor = useEditorStatic()
  const { nodeList } = useNodes()
  const tagNames = nodeList.tagNodes
    .map((node) => node.props.tag!)
    .filter((i) => !!i)

  const filteredTypes = tagNames.filter((item) => {
    const q = Node.string(element).replace(/^#/, '').toLowerCase()
    if (!q) return true
    return item.toLowerCase().includes(q)
  })

  const text = Node.string(element)

  const selectTag = useCallback(
    (tagName: any) => {
      const path = findNodePath(editor, element)!

      Transforms.setNodes<TagElement>(
        editor,
        {
          type: ELEMENT_TAG,
          name: tagName,
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
    onEnter: (cursor) => {
      console.log('enter.......xx')
      if (!filteredTypes.length) {
        console.log('create tag......')

        store.createTag(text)
        selectTag(text)
        return
      }
      selectTag(filteredTypes[cursor])
    },
    listLength: filteredTypes.length,
    listItemIdPrefix,
  })

  if (!filteredTypes.length) {
    return (
      <Box py3 px3 gray400>
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
            onClick={() => {
              selectTag(name)
            }}
          />
        )
      })}
    </Box>
  )
}
