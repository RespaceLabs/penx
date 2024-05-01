import { useCallback, useMemo } from 'react'
import { Box } from '@fower/react'
import { Editor, Node, Path, Transforms } from 'slate'
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import {
  ELEMENT_TAG,
  FILE_DATABASE_NAME,
  TODO_DATABASE_NAME,
} from '@penx/constants'
import { PenxEditor, useEditorStatic } from '@penx/editor-common'
import { findNodePath, getNodeByPath } from '@penx/editor-queries'
import { db, formatTagName, getRandomColor } from '@penx/local-db'
import { INode } from '@penx/model-types'
import { useNodes } from '@penx/node-hooks'
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
    .filter((name) => ![TODO_DATABASE_NAME, FILE_DATABASE_NAME].includes(name))

  editor.isInTodoPage

  const text = getSearchText(editor, element)
  // const tagName = text.replace(/^#/, '')
  const tagName = formatTagName(text.replace(/^#/, ''))

  const filteredTypes = useMemo(() => {
    const q = text.replace(/^#/, '').toLowerCase()

    let tags = tagNames
      .filter((item) => {
        return (
          item.toLowerCase().includes(q) && item.toLowerCase() !== 'untitled'
        )
      })
      .filter((item) => !item.startsWith('$template__'))
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
        database = await store.node.createDatabase(editor.spaceId, tagName)
        selectTag(tagName, database.id)
      } else {
        const name = filteredTypes[cursor]
        database = await db.getDatabaseByName(editor.spaceId, name)
        selectTag(name, database.id)
      }

      setTimeout(() => {
        editor.isTagSelectorOpened = false
      }, 50)
    },
    listLength: filteredTypes.length,
    listItemIdPrefix,
  })
  const color = useMemo(() => getRandomColor(), [])

  if (!filteredTypes.length) {
    return (
      <Box
        py1
        px3
        textSM
        roundedLG
        cursorPointer
        onClick={async () => {
          const database = await store.node.createDatabase(
            editor.spaceId,
            tagName,
          )
          selectTag(tagName, database.id)
        }}
      >
        Create tag &quot;
        <Box as="span" color={color}>
          {text}
        </Box>
        &quot;
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
              const database = await db.getDatabaseByName(editor.spaceId, name)
              selectTag(name, database.id)
            }}
          />
        )
      })}
    </Box>
  )
}
