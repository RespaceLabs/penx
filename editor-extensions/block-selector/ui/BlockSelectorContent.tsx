import { useCallback } from 'react'
import { ELEMENT_DATABASE_CONTAINER } from '@/lib/constants'
import { TElement, useEditorStatic } from '@/lib/editor-common'
import { selectEditor } from '@/lib/editor-transforms'
import { extensionStore } from '@/lib/extension-store'
import { INode, NodeType } from '@/lib/model'
import { ListsEditor } from '@/lib/slate-lists'

import { Editor, Element, Node, Path, Transforms } from 'slate'
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

  // console.log('-------====editor.node:', editor)

  const filteredTypes = Object.keys(extensionStore.elementMaps).filter(
    (item) => {
      const { type, slashCommand } = extensionStore.elementMaps[item]
      if (!slashCommand) return false
      if (editor.isOutliner && !slashCommand.in.includes('OUTLINER')) {
        return false
      }

      if (!editor.isOutliner && !slashCommand.in.includes('BLOCK')) {
        return false
      }
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

        if (elementType === ELEMENT_DATABASE_CONTAINER) {
          props.databaseId = node.id
          props.maxHeight = 300
        }

        Transforms.insertNodes(editor, props, { at })

        if (editor.isOutliner) {
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
            } as any),
            { at: next, select: true },
          )
        }
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
    [editor, close, element],
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
    return <div className="p-3 text-foreground/40">No results</div>
  }

  return (
    <div className="flex flex-col gap-1">
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
    </div>
  )
}
