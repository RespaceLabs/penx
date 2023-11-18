import { useCallback } from 'react'
import { Box } from '@fower/react'
import { Editor, Element, Node, Path, Transforms } from 'slate'
import { ListsEditor } from 'slate-lists'
import { TElement, useEditorStatic } from '@penx/editor-common'
import { selectEditor } from '@penx/editor-transforms'
import { useExtensionStore } from '@penx/hooks'
import { INode, NodeType } from '@penx/model-types'
import { isBlockSelector } from '../isBlockSelector'
import { useKeyDownList } from '../useKeyDownList'
import { BlockSelectorItem } from './BlockSelectorItem'

interface Props {
  close: any
  element: any
  containerRef: any
}

export const BlockSelectorContent = ({ close, element }: Props) => {
  const editor = useEditorStatic()
  const { extensionStore } = useExtensionStore()

  const filteredTypes = Object.keys(extensionStore.elementMaps).filter(
    (item) => {
      const { type, slashCommand } = extensionStore.elementMaps[item]
      if (!slashCommand) return false
      const q = Node.string(element).replace(/^\//, '').toLowerCase()
      if (!q) return true
      return (
        slashCommand.name.toLowerCase().includes(q) ||
        type.toLowerCase().includes(q)
      )
    },
  )

  /**
   * TODO: need refactor
   */
  const selectType = useCallback(
    async (elementType: any) => {
      const elementInfo = extensionStore.elementMaps[elementType]
      const { slashCommand } = elementInfo

      if (!elementInfo) return // TODO
      close()

      const block = Editor.above(editor, {
        match: (n) => Editor.isBlock(editor, n as Element),
      })

      const at = block ? block[1] : []

      if (elementInfo.isInline) return

      if (elementInfo.shouldNested) {
        /**
         * remove block first, then insert
         * don't use setNodes，@see  https://github.com/ianstormtaylor/slate/issues/4020
         */
        Transforms.removeNodes(editor, { at })

        Transforms.insertNodes(editor, slashCommand?.defaultNode as any, { at })

        Transforms.select(editor, Editor.start(editor, at))

        setTimeout(() => {
          editor.isBlockSelectorOpened = false
        }, 50)
        return
      }

      // image,divider...
      if (elementInfo.isVoid) {
        Transforms.removeNodes(editor, { at })

        const node: INode = await slashCommand?.beforeInvokeCommand?.(editor)

        const props = {
          type: elementType,
          children: [{ text: '' }],
        } as TElement & { [key: string]: any }

        if (node?.type === NodeType.DATABASE) {
          props.id = node.id
          props.databaseId = node.id
        }

        Transforms.insertNodes(editor, props, { at })

        const next = Path.next(Path.parent(at))

        // create new empty list item node
        Transforms.insertNodes(
          editor,
          ListsEditor.createListItemTextNode(editor, {
            children: [
              {
                type: 'p',
                children: [{ text: '' }],
              } as TElement,
            ],
          }),
          {
            at: next,
            select: true,
          },
        )
      } else {
        // p,h1,h2,h3,h4...
        Transforms.setNodes(
          editor,
          {
            type: elementType,
            ...slashCommand?.defaultNode,
          } as TElement,
          {
            // mode: 'lowest',
            match: (n) =>
              Element.isElement(n) &&
              Editor.isBlock(editor, n) &&
              !isBlockSelector(n),
          },
        )

        Transforms.removeNodes(editor, {
          match: (n: any) => n.id === element.id,
        })

        selectEditor(editor, { focus: true, at })
      }

      setTimeout(() => {
        editor.isBlockSelectorOpened = false
      }, 50)
    },
    [editor, close, element, extensionStore],
  )

  const listItemIdPrefix = 'type-list-item-'

  const { cursor } = useKeyDownList({
    onEnter: (cursor) => {
      selectType(filteredTypes[cursor])
    },
    listLength: filteredTypes.length,
    listItemIdPrefix,
  })

  if (!filteredTypes.length) {
    return (
      <Box py3 px3 gray400>
        No results
      </Box>
    )
  }

  return (
    <Box column gapY-1>
      {filteredTypes.map((type, i) => {
        const { slashCommand } = extensionStore.elementMaps[type]

        return (
          <BlockSelectorItem
            key={type}
            id={listItemIdPrefix + i}
            name={slashCommand?.name || ''}
            description={slashCommand?.description}
            isActive={i === cursor}
            icon={slashCommand?.icon}
            onClick={() => {
              selectType(type)
            }}
          />
        )
      })}
    </Box>
  )
}
