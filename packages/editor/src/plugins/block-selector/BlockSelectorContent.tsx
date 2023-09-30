import { useCallback } from 'react'
import { Box } from '@fower/react'
import { Editor, Element, Node, Transforms } from 'slate'
import { useSlateStatic } from 'slate-react'
import { ElementType } from '@penx/editor-shared'
import { selectEditor } from '@penx/editor-transforms'
import { useKeyDownList } from '../../hooks/useKeyDownList'
import { BlockSelectorItem } from './BlockSelectorItem'

const types = [
  ElementType.p,
  ElementType.check_list_item,
  ElementType.h1,
  ElementType.h2,
  ElementType.h3,
  ElementType.h4,
  ElementType.hr,
  ElementType.code_block,
  ElementType.img,
  ElementType.table,
  // 'internal_link_selector',
]

interface Props {
  close: any
  element: Element
  containerRef: any
}

export const BlockSelectorContent = ({ close, element }: Props) => {
  const editor = useSlateStatic()

  const filteredTypes = types.filter((item) => {
    const { name = '', type } = editor.elementMaps[item]
    const q = Node.string(element).replace(/^\//, '').toLowerCase()
    if (!q) return true
    return name.toLowerCase().includes(q) || type.toLowerCase().includes(q)
  })

  /**
   * TODO: need refactoring
   */
  const selectType = useCallback(
    (elementType: any) => {
      const elementInfo = editor.elementMaps[elementType]
      if (!elementInfo) return // TODO
      close()

      const block = Editor.above(editor, {
        match: (n) => Editor.isBlock(editor, n as Element),
      })

      const at = block ? block[1] : []

      if (elementInfo.isInline) {
        return
      }

      if (elementInfo.shouldNested) {
        /**
         * remove block first, then insert
         * don't use setNodes，@see  https://github.com/ianstormtaylor/slate/issues/4020
         */
        Transforms.removeNodes(editor, { at })
        Transforms.insertNodes(
          editor,
          {
            selected: true,
            ...elementInfo.defaultValue,
            ...elementInfo.defaultConfig,
          } as any,
          { at },
        )
        Transforms.select(editor, Editor.start(editor, at))
        return
      }

      // image,divider...
      if (elementInfo.isVoid) {
        Transforms.removeNodes(editor, {
          match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
        })

        Transforms.insertNodes(editor, {
          type: elementType,
          children: [{ text: '' }],
        })

        if ([ElementType.hr].includes(elementType)) {
          Transforms.insertNodes(editor, {
            type: ElementType.p,
            children: [{ text: '' }],
          })
        }
      } else {
        // p,h1,h2,h3,h4...
        Transforms.setNodes(
          editor,
          {
            type: elementType,
            selected: true,
            ...elementInfo.defaultValue,
            ...elementInfo.defaultConfig,
          } as any,
          {
            // mode: 'lowest',
            match: (n) =>
              Element.isElement(n) &&
              Editor.isBlock(editor, n) &&
              n.type !== ElementType.block_selector,
          },
        )

        Transforms.removeNodes(editor, { match: (n) => n.id === element.id })

        selectEditor(editor, { focus: true, at })
      }
    },
    [editor, close, element],
  )

  const listItemIdPrefix = 'type-list-item-'

  const { cursor, setCursor } = useKeyDownList({
    onEnter: (cursor) => {
      selectType(filteredTypes[cursor])
    },
    listLength: filteredTypes.length,
    listItemIdPrefix,
  })

  return (
    <Box column gapY-1>
      {filteredTypes.map((type, i) => {
        const { name, icon } = editor.elementMaps[type]
        return (
          <BlockSelectorItem
            key={type}
            id={listItemIdPrefix + i}
            name={name || ''}
            isActive={i === cursor}
            icon={icon}
            onClick={() => selectType(type)}
          />
        )
      })}
    </Box>
  )
}
