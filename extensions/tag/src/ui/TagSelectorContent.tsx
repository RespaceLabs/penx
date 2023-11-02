import { useCallback } from 'react'
import { Box } from '@fower/react'
import { Editor, Element, Node, Path, Transforms } from 'slate'
import { ListsEditor } from 'slate-lists'
import { TElement, useEditorStatic } from '@penx/editor-common'
import { selectEditor } from '@penx/editor-transforms'
import { useExtensionStore, useNodes } from '@penx/hooks'
import { store } from '@penx/store'
import { isTag } from '../isTag'
import { useKeyDownList } from '../useKeyDownList'
import { TagSelectorItem } from './TagSelectorItem'

interface Props {
  close: any
  element: any
  containerRef: any
}

export const TagSelectorContent = ({ close, element }: Props) => {
  const editor = useEditorStatic()
  const { extensionStore } = useExtensionStore()

  const { nodeList } = useNodes()

  const tagNames = nodeList.tagNodes.map((node) => node.props.tag!)

  const filteredTypes = tagNames.filter((item) => {
    const q = Node.string(element).replace(/^#/, '').toLowerCase()
    if (!q) return true
    return item.toLowerCase().includes(q)
  })

  const text = Node.string(element)

  /**
   * TODO: need refactoring
   */
  const selectType = useCallback(
    (elementType: any) => {
      //
    },
    [editor, close, element, extensionStore],
  )

  const listItemIdPrefix = 'type-list-item-'

  const { cursor } = useKeyDownList({
    onEnter: (cursor) => {
      console.log('enter----:', text, cursor)
      if (!filteredTypes.length) {
        store.createTag(text)
        return
      }
      selectType(filteredTypes[cursor])
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
              selectType(name)
            }}
          />
        )
      })}
    </Box>
  )
}
