import { useCallback, useMemo } from 'react'
import { Box } from '@fower/react'
import { Editor, Node, Path, Transforms } from 'slate'
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { usePublicClient } from 'wagmi'
import { ELEMENT_TAG, TODO_DATABASE_NAME } from '@penx/constants'
import { PenxEditor, useEditorStatic } from '@penx/editor-common'
import { findNodePath, getNodeByPath } from '@penx/editor-queries'
import { useNodes } from '@penx/hooks'
import { db } from '@penx/local-db'
import { INode } from '@penx/model-types'
import { getEmptyParagraph } from '@penx/paragraph'
import { store } from '@penx/store'
import { api, trpc } from '@penx/trpc-client'
import { TagElement, TagSelectorElement } from '../../types'
import { useKeyDownList } from '../../useKeyDownList'
import { TagSelectorItem } from './TagSelectorItem'

interface Props {
  close: any
  element: TagSelectorElement
  containerRef: any
}

const listItemIdPrefix = 'type-list-item-'

const TRANSLATOR = 'translator'
const GAS_PRICE = 'gas_price'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})

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

function getBlockText(editor: PenxEditor, element: TagSelectorElement) {
  const path = findNodePath(editor, element)!
  const node = getNodeByPath(editor, Path.parent(path))!
  let text = Node.string(node)
  return text.replace(/#$/, '').trim()
}

export const TagSelectorContent = ({ close, element }: Props) => {
  const editor = useEditorStatic()
  const { nodeList } = useNodes()
  const tagNames = nodeList.tagNodes
    .map((node) => node.props.name!)
    .filter((name) => name !== TODO_DATABASE_NAME)

  const text = getSearchText(editor, element)
  const tagName = text.replace(/^#/, '')

  const filteredTypes = useMemo(() => {
    const q = text.replace(/^#/, '').toLowerCase()

    let tags = tagNames.filter((item) => {
      return item.toLowerCase().includes(q) && item.toLowerCase() !== 'untitled'
    })
    return tags
  }, [tagNames, text])

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

      if (tagName === TRANSLATOR) {
        const blockText = getBlockText(editor, element)

        api.translator.googleTranslate
          .query({
            text: blockText,
            from: 'auto',
            to: 'en',
          })
          .then((res) => {
            // console.log('=======res:', res)
            Transforms.insertNodes(editor, getEmptyParagraph(res.text), {
              at: Path.next(Path.parent(path)),
              select: true,
            })
          })
      } else if (tagName === GAS_PRICE) {
        client.getGasPrice().then((res) => {
          const gas_price = res / BigInt(1000000000)
          const eth = Number(gas_price)
          const usd = eth * 3450

          // console.log('gasPrice==========:', res, gas_price.toString())
          Transforms.insertNodes(
            editor,
            getEmptyParagraph(`Gas Price: ${gas_price.toString()}Gwei `),
            {
              at: Path.next(Path.parent(path)),
              select: true,
            },
          )
        })
      } else {
        // focus to next node
        const nextNode = getNodeByPath(editor, Path.next(path))!

        if (nextNode) {
          Transforms.select(editor, Editor.start(editor, Path.next(path)))
        }
      }

      setTimeout(() => {
        close()
      }, 0)
    },
    [editor, close, element],
  )

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
      <Box py2 px3 textSM bgGray100 roundedLG>
        Create tag &quot;{text}&quot;
      </Box>
    )
  }

  return (
    <Box column gapY-1>
      {filteredTypes.map((name, i) => {
        const node = nodeList.tagNodes.find((node) => node.props.name === name)!

        return (
          <TagSelectorItem
            key={name}
            id={listItemIdPrefix + i}
            name={name}
            node={node}
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
